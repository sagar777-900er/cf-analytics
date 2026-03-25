import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, 'watchlist.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── In-Memory Cache ─────────────────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── CF API Fetcher (with cache middleware) ──────────────────────────────────
async function fetchCF(endpoint, cacheKey) {
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://codeforces.com/api/${endpoint}`);
    const text = await res.text();
    const data = JSON.parse(text);
    
    if (data.status === 'FAILED') {
      throw new Error(data.comment || 'Codeforces API error');
    }
    
    setCache(cacheKey, data.result);
    return data.result;
  } catch (err) {
    if (err.name === 'SyntaxError') {
      throw new Error('Codeforces API rate limited (Wait a few seconds)');
    }
    throw err;
  }
}

// ─── Supabase Client (optional) ─────────────────────────────────────────────
let supabase = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your_supabase')) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase connected');
} else {
  console.log('⚠️  Supabase not configured — watchlist features disabled');
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/user/:handle — user info
app.get('/api/user/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const data = await fetchCF(`user.info?handles=${handle}`, `user:${handle}`);
    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/rating/:handle — contest rating history
app.get('/api/rating/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const data = await fetchCF(`user.rating?handle=${handle}`, `rating:${handle}`);
    const formatted = data.map((entry) => ({
      contestName: entry.contestName,
      contestId: entry.contestId,
      rank: entry.rank,
      oldRating: entry.oldRating,
      newRating: entry.newRating,
      date: new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      timestamp: entry.ratingUpdateTimeSeconds,
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/submissions/:handle — submissions with server-side aggregation
app.get('/api/submissions/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const submissions = await fetchCF(`user.status?handle=${handle}`, `submissions:${handle}`);

    // Aggregate data server-side
    const solvedSet = new Set();
    const ratingCount = {};
    const tagCount = {};
    const solvedProblems = [];

    submissions.forEach((sub) => {
      if (sub.verdict === 'OK') {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!solvedSet.has(key)) {
          solvedSet.add(key);
          const rating = sub.problem.rating;

          if (rating) {
            ratingCount[rating] = (ratingCount[rating] || 0) + 1;
          }

          (sub.problem.tags || []).forEach((tag) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });

          solvedProblems.push({
            contestId: sub.problem.contestId,
            index: sub.problem.index,
            name: sub.problem.name,
            rating: sub.problem.rating || null,
            tags: sub.problem.tags || [],
          });
        }
      }
    });

    // Build rating buckets
    const buckets = {};
    Object.entries(ratingCount).forEach(([rating, count]) => {
      const r = Number(rating);
      const start = Math.floor(r / 200) * 200;
      const end = start + 200;
      const key = `${start}-${end}`;
      buckets[key] = (buckets[key] || 0) + count;
    });

    const bucketArray = Object.entries(buckets)
      .map(([range, count]) => ({ range, count, start: Number(range.split('-')[0]) }))
      .sort((a, b) => a.start - b.start);

    // Top tags for radar chart
    const tagArray = Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Best rating
    const bestRating = Object.keys(ratingCount).length
      ? Math.max(...Object.keys(ratingCount).map(Number))
      : null;

    res.json({
      success: true,
      data: {
        solvedCount: solvedSet.size,
        bestRating,
        ratingDistribution: Object.entries(ratingCount)
          .map(([rating, count]) => ({ rating: Number(rating), count }))
          .sort((a, b) => a.rating - b.rating),
        buckets: bucketArray,
        tagStats: tagArray,
        solvedProblems,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/training/:handle — suggest 5 unsolved problems in rating+200 range
app.get('/api/training/:handle', async (req, res) => {
  try {
    const { handle } = req.params;

    // Get user's current rating
    const userInfo = await fetchCF(`user.info?handles=${handle}`, `user:${handle}`);
    const currentRating = userInfo[0].rating || 800;
    const targetRating = Math.ceil((currentRating + 200) / 100) * 100; // round to nearest 100

    // Get user's solved problems
    const submissions = await fetchCF(`user.status?handle=${handle}`, `submissions:${handle}`);
    const solvedKeys = new Set();
    submissions.forEach((sub) => {
      if (sub.verdict === 'OK') {
        solvedKeys.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });

    // Fetch problemset and filter
    const problems = await fetchCF('problemset.problems', 'problemset');
    const candidates = (problems.problems || [])
      .filter((p) => {
        if (!p.rating) return false;
        if (p.rating < targetRating - 100 || p.rating > targetRating + 100) return false;
        const key = `${p.contestId}-${p.index}`;
        return !solvedKeys.has(key);
      })
      .slice(0, 50);

    // Randomly pick 5
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    const suggestions = shuffled.slice(0, 5).map((p) => ({
      contestId: p.contestId,
      index: p.index,
      name: p.name,
      rating: p.rating,
      tags: p.tags,
      url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
    }));

    res.json({
      success: true,
      data: {
        currentRating,
        targetRating,
        suggestions,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
// GET /api/problems — fetch specific random problems for a virtual contest
app.get('/api/problems', async (req, res) => {
  try {
    const minRating = parseInt(req.query.minRating) || 800;
    const maxRating = parseInt(req.query.maxRating) || 3500;
    const handle = req.query.handle;
    const count = parseInt(req.query.count) || 5;

    const problemsData = await fetchCF('problemset.problems', 'problemset');
    let candidates = problemsData.problems || [];

    candidates = candidates.filter(p => p.rating && p.rating >= minRating && p.rating <= maxRating);

    if (handle) {
      try {
        const submissions = await fetchCF(`user.status?handle=${handle}`, `submissions:${handle}`);
        const solvedKeys = new Set();
        submissions.forEach(sub => {
          if (sub.verdict === 'OK') {
            solvedKeys.add(`${sub.problem.contestId}-${sub.problem.index}`);
          }
        });
        candidates = candidates.filter(p => !solvedKeys.has(`${p.contestId}-${p.index}`));
      } catch (err) {
        console.warn(`Could not fetch submissions for ${handle}:`, err.message);
      }
    }

    const shuffled = candidates.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count).map(p => ({
      contestId: p.contestId,
      index: p.index,
      name: p.name,
      rating: p.rating,
      tags: p.tags,
      url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`
    }));

    selected.sort((a, b) => a.rating - b.rating);

    res.json({ success: true, data: selected });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ─── Watchlist Routes (Supabase / Local DB Fallback) ─────────────────────────

// Initialize local file DB if needed
if (!supabase && !fs.existsSync(LOCAL_DB_PATH)) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([]));
}

function getLocalWatchlist() {
  try { return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8')); }
  catch { return []; }
}

function saveLocalWatchlist(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

app.get('/api/watchlist', async (req, res) => {
  let list = [];
  try {
    if (!supabase) {
      list = getLocalWatchlist();
    } else {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      list = data;
    }

    // Optional enrichment
    if (req.query.enrich === 'true' && list.length > 0) {
      const handles = list.map(w => w.handle).join(';');
      try {
        const cfData = await fetchCF(`user.info?handles=${handles}`, `users:${handles}`);
        // Merge
        const cfMap = {};
        cfData.forEach(user => {
          cfMap[user.handle.toLowerCase()] = user;
        });
        
        list = list.map(w => {
          const u = cfMap[w.handle.toLowerCase()];
          return {
            ...w,
            rating: u?.rating || 0,
            maxRating: u?.maxRating || 0,
            rank: u?.rank || 'unrated',
            titlePhoto: u?.titlePhoto
          };
        });
        
        // Sort
        list.sort((a, b) => b.rating - a.rating);
      } catch (err) {
        console.warn('Enrichment failed:', err.message);
      }
    }

    res.json({ success: true, data: list, disabled: !supabase && false /* disabled is basically never true now */ });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/watchlist', async (req, res) => {
  const { handle } = req.body;
  if (!handle) return res.status(400).json({ success: false, error: 'Handle is required' });

  if (!supabase) {
    const list = getLocalWatchlist();
    if (!list.find(w => w.handle === handle.toLowerCase())) {
      list.unshift({ handle: handle.toLowerCase(), created_at: new Date().toISOString() });
      saveLocalWatchlist(list);
    }
    return res.json({ success: true, data: { handle: handle.toLowerCase() } });
  }

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .upsert({ handle: handle.toLowerCase() }, { onConflict: 'handle' })
      .select();

    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/watchlist/:handle', async (req, res) => {
  const { handle } = req.params;

  if (!supabase) {
    const list = getLocalWatchlist();
    saveLocalWatchlist(list.filter(w => w.handle !== handle.toLowerCase()));
    return res.json({ success: true });
  }

  try {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('handle', handle.toLowerCase());

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', supabase: !!supabase, cacheSize: cache.size });
});

// ─── Production Static Serving ───────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CF Analytics API running on http://localhost:${PORT}`);
});
