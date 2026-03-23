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
    <div className="bento-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[rgba(251,146,60,0.1)] flex items-center justify-center">
            <Star className="w-4 h-4 text-[var(--color-orange)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Watchlist</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
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
              color: isStarred ? 'var(--color-orange)' : 'var(--color-text-secondary)',
              borderColor: isStarred ? 'rgba(251,146,60,0.2)' : 'var(--color-border)',
              backgroundColor: isStarred ? 'rgba(251,146,60,0.1)' : 'transparent',
            }}
          >
            {isStarred ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
            {isStarred ? 'Unstar' : 'Star'}
          </button>
        )}
      </div>

      {disabled ? (
        <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] rounded-xl p-3 text-center">
          Add Supabase credentials to <code className="text-[var(--color-accent)]">.env</code> to enable watchlist
        </p>
      ) : watchlist.length > 0 ? (
        <div className="space-y-1.5">
          {watchlist.map((w) => (
            <div
              key={w.handle}
              className="group flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
            >
              <span className="text-sm font-medium font-mono">{w.handle}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAnalyze(w.handle)}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeHandle(w.handle)}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-red)] hover:bg-[rgba(248,113,113,0.1)] opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[var(--color-text-muted)] text-center py-4">
          Star a handle to add it to your watchlist
        </p>
      )}
    </div>
  );
}
