import { Dumbbell, ExternalLink, Tag } from 'lucide-react';

export default function TrainingRange({ training }) {
  if (!training?.suggestions?.length) return null;

  return (
    <div className="glass-card animate-fade-in animate-fade-in-delay-3 p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[rgba(251,191,36,0.1)] flex items-center justify-center glow-cyan">
            <Dumbbell className="w-4 h-4 text-[#fbbf24]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Training Range</h3>
            <p className="text-xs text-slate-400">
              Target: <span className="text-[#fbbf24] font-mono font-semibold">{training.targetRating}</span> rated problems
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[rgba(251,191,36,0.1)] text-[#fbbf24] border border-[rgba(251,191,36,0.15)]">
          +200 from current
        </span>
      </div>

      <div className="space-y-2">
        {training.suggestions.map((p, i) => (
          <a
            key={`${p.contestId}-${p.index}`}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#1e293b]/50 border border-white/5 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 transition-all"
          >
            <span className="w-6 h-6 rounded-lg bg-[#0f0f0f] flex items-center justify-center text-[10px] font-bold text-slate-400 font-mono shrink-0 border border-white/5">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-slate-200 group-hover:text-[#00f0ff] transition-colors">
                {p.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-slate-500">
                  {p.contestId}{p.index}
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#fbbf24]">
                  {p.rating}
                </span>
                {p.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-[#0f0f0f] text-slate-400 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
