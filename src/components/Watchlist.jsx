import { useState, useEffect } from 'react';
import { Star, StarOff, Eye, Trash2 } from 'lucide-react';

export default function Watchlist({ currentHandle, onAnalyze, userData }) {
  const [watchlist, setWatchlist] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [starring, setStarring] = useState(false);

  const isStarred = watchlist.some(
    (w) => w.handle === currentHandle?.toLowerCase()
  );

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist?enrich=true');
      const data = await res.json();
      if (data.disabled) {
        setDisabled(true);
        return;
      }
      if (data.success) setWatchlist(data.data || []);
    } catch {
      setDisabled(true);
    }
  };

  const toggleStar = async () => {
    if (!currentHandle || disabled) return;
    setStarring(true);

    try {
      if (isStarred) {
        await fetch(`/api/watchlist/${currentHandle.toLowerCase()}`, { method: 'DELETE' });
      } else {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle: currentHandle }),
        });
      }
      await fetchWatchlist();
    } catch {}

    setStarring(false);
  };

  const removeHandle = async (handle) => {
    try {
      await fetch(`/api/watchlist/${handle}`, { method: 'DELETE' });
      await fetchWatchlist();
    } catch {}
  };

  if (disabled && !watchlist.length) return null;

  return (
    <div className="glass-card animate-fade-in p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[rgba(249,115,22,0.1)] flex items-center justify-center glow-orange">
            <Star className="w-4 h-4 text-[#fbbf24]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Live Leaderboard</h3>
            <p className="text-xs text-slate-400">
              {disabled ? 'Supabase not configured' : `${watchlist.length} rivals tracked`}
            </p>
          </div>
        </div>

        {currentHandle && !disabled && (
          <button
            onClick={toggleStar}
            disabled={starring}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
            style={{
              color: isStarred ? '#fbbf24' : '#cbd5e1',
              borderColor: isStarred ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.1)',
              backgroundColor: isStarred ? 'rgba(249,115,22,0.1)' : 'transparent',
            }}
          >
            {isStarred ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
            {isStarred ? 'Unstar' : 'Star'}
          </button>
        )}
      </div>

      {disabled ? (
        <p className="text-xs text-slate-400 bg-[#1e293b]/50 rounded-xl p-3 text-center border border-white/5">
          Add Supabase credentials to <code className="text-[#38bdf8]">.env</code> to enable watchlist
        </p>
      ) : watchlist.length > 0 ? (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          {watchlist.map((w, index) => (
            <div
              key={w.handle}
              className="group relative flex items-center justify-between px-4 py-3 rounded-xl bg-[#0f0f0f]/50 border border-white/5 hover:border-[#fbbf24]/30 transition-all overflow-hidden"
            >
              {index === 0 && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#fbbf24]/20 to-transparent flex items-start justify-end p-2 pointer-events-none rounded-tr-xl">
                  <Star className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24] opacity-80" />
                </div>
              )}
              
              <div className="flex items-center gap-4 z-10 w-full">
                <div className="text-xs font-black text-slate-500 w-4">#{index + 1}</div>
                {w.titlePhoto && (
                  <img 
                    src={w.titlePhoto.startsWith('//') ? `https:${w.titlePhoto}` : w.titlePhoto} 
                    className="w-8 h-8 rounded-lg object-cover border border-white/10"
                    alt={w.handle}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold font-mono text-white truncate block">{w.handle}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {w.rank || 'Unrated'}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black font-mono ${w.rating > (userData?.rating || 0) ? 'text-[#fbbf24]' : 'text-[#38bdf8]'}`}>
                    {w.rating || 0}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Max: {w.maxRating || 0}
                  </div>
                </div>
              </div>

              {/* Hover Actions Menu */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all bg-[#0f0f0f] px-2 py-1 rounded-lg border border-white/10 shadow-xl z-20">
                <button
                  onClick={() => onAnalyze(w.handle)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#38bdf8] hover:bg-[rgba(0,240,255,0.1)] transition-all"
                  title="Analyze Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeHandle(w.handle)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-all"
                  title="Remove from Leaderboard"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-4">
          Star a handle to add it to your watchlist
        </p>
      )}
    </div>
  );
}
