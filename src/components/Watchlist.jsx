import { useState, useEffect } from 'react';
import { Star, StarOff, Eye, Trash2 } from 'lucide-react';

export default function Watchlist({ currentHandle, onAnalyze }) {
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
      const res = await fetch('/api/watchlist');
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
            <Star className="w-4 h-4 text-[#f97316]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Watchlist</h3>
            <p className="text-xs text-slate-400">
              {disabled ? 'Supabase not configured' : `${watchlist.length} handles`}
            </p>
          </div>
        </div>

        {currentHandle && !disabled && (
          <button
            onClick={toggleStar}
            disabled={starring}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
            style={{
              color: isStarred ? '#f97316' : '#cbd5e1',
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
          Add Supabase credentials to <code className="text-[#00f0ff]">.env</code> to enable watchlist
        </p>
      ) : watchlist.length > 0 ? (
        <div className="space-y-1.5">
          {watchlist.map((w) => (
            <div
              key={w.handle}
              className="group flex items-center justify-between px-3 py-2 rounded-xl bg-[#1e293b]/50 border border-white/5 hover:border-white/20 transition-all"
            >
              <span className="text-sm font-medium font-mono text-slate-200">{w.handle}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAnalyze(w.handle)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeHandle(w.handle)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
