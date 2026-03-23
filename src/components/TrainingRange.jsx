import { Dumbbell, ExternalLink, Tag } from 'lucide-react';

export default function TrainingRange({ training }) {
  if (!training?.suggestions?.length) return null;

  return (
    <div className="bento-card animate-fade-in animate-fade-in-delay-3">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[rgba(251,191,36,0.1)] flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-[var(--color-yellow)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Training Range</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Target: <span className="text-[var(--color-yellow)] font-mono font-semibold">{training.targetRating}</span> rated problems
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[rgba(251,191,36,0.1)] text-[var(--color-yellow)] border border-[rgba(251,191,36,0.15)]">
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
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[rgba(255,255,255,0.02)] transition-all"
          >
            <span className="w-6 h-6 rounded-lg bg-[var(--color-bg-card)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-muted)] font-mono shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-[var(--color-accent)] transition-colors">
                {p.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  {p.contestId}{p.index}
                </span>
                <span className="text-[10px] font-mono font-semibold text-[var(--color-yellow)]">
                  {p.rating}
                </span>
                {p.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-bg-card)] text-[var(--color-text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
