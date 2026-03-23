import { useState } from 'react';
import { Search, Zap, ExternalLink } from 'lucide-react';

export default function Header({ onAnalyze, loading }) {
  const [handle, setHandle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handle.trim()) {
      onAnalyze(handle.trim());
    }
  };

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">
              CF <span className="text-[var(--color-text-secondary)] font-normal">Analytics</span>
            </span>
          </div>

          {/* Search */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter Codeforces handle..."
                className="w-full pl-10 pr-24 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent-glow)] transition-all"
              />
              <button
                type="submit"
                disabled={loading || !handle.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-white transition-all"
              >
                {loading ? 'Loading...' : 'Analyze'}
              </button>
            </div>
          </form>

          {/* GitHub link */}
          <a
            href="https://github.com/sagar777-900er/cf-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors shrink-0"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
