import { useState } from 'react';
import { Swords, Loader2, Play, ExternalLink } from 'lucide-react';

export default function VirtualContest({ currentHandle }) {
  const [minRating, setMinRating] = useState(1200);
  const [maxRating, setMaxRating] = useState(1600);
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const q = new URLSearchParams({
        minRating: minRating.toString(),
        maxRating: maxRating.toString(),
        count: '5'
      });
      if (currentHandle) q.append('handle', currentHandle);

      const res = await fetch(`/api/problems?${q.toString()}`);
      const json = await res.json();

      if (json.success) {
        setProblems(json.data);
      } else {
        throw new Error(json.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate contest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(255,0,127,0.1)] flex items-center justify-center glow-pink shadow-lg">
          <Swords className="w-5 h-5 text-[#a78bfa]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">Virtual Contest Generator</h3>
          <p className="text-xs text-slate-400">Create a 5-problem custom mashup</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Min Rating</label>
            <input
              type="number"
              value={minRating}
              onChange={(e) => setMinRating(parseInt(e.target.value) || 800)}
              step="100"
              className="w-full bg-[#0f0f0f]/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Max Rating</label>
            <input
              type="number"
              value={maxRating}
              onChange={(e) => setMaxRating(parseInt(e.target.value) || 3500)}
              step="100"
              className="w-full bg-[#0f0f0f]/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || minRating > maxRating}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#a78bfa]/20 hover:bg-[#a78bfa]/40 border border-[#a78bfa]/50 text-[#a78bfa] font-bold text-sm transition-all glow-pink disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          Generate Contest
        </button>
      </form>

      {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

      {problems.length > 0 && (
        <div className="space-y-2">
          {problems.map((p, i) => (
            <a
              key={`${p.contestId}-${p.index}`}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-[#0f0f0f]/40 border border-white/5 hover:border-[#a78bfa]/50 rounded-xl p-3 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold font-mono text-slate-600 group-hover:text-[#a78bfa] transition-colors w-6">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate max-w-[200px] sm:max-w-xs">{p.name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{p.contestId}{p.index} • Rating: {p.rating}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
