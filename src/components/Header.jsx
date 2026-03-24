import { useState } from 'react';
import { Search, Zap, ExternalLink, Users } from 'lucide-react';

export default function Header({ onAnalyze, onAnalyzeH2H, loading, isH2HMode, setIsH2HMode }) {
  const [handle, setHandle] = useState('');
  const [handle1, setHandle1] = useState('');
  const [handle2, setHandle2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isH2HMode) {
      if (handle1.trim() && handle2.trim()) onAnalyzeH2H(handle1.trim(), handle2.trim());
    } else {
      if (handle.trim()) onAnalyze(handle.trim());
    }
  };

  return (
    <header className="glass-card sticky top-0 z-50 rounded-none border-t-0 border-l-0 border-r-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient flex items-center justify-center glow-purple">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block text-white">
              CF <span className="text-slate-400 font-normal">Analytics</span>
            </span>
          </div>

          {/* Search */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-xl flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsH2HMode(!isH2HMode)}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${isH2HMode ? 'bg-[rgba(255,0,127,0.1)] border-[#ff007f]/30 text-[#ff007f] glow-pink' : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white'}`}
            >
              <Users className="w-3.5 h-3.5" />
              VS
            </button>
            
            {isH2HMode ? (
              <div className="flex-1 flex items-center gap-2 group">
                <input
                  type="text"
                  value={handle1}
                  onChange={(e) => setHandle1(e.target.value)}
                  placeholder="Player 1..."
                  className="w-full px-4 py-2 bg-slate-900/80 border border-white/10 rounded-l-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
                />
                <span className="text-slate-500 font-black italic text-sm">VS</span>
                <input
                  type="text"
                  value={handle2}
                  onChange={(e) => setHandle2(e.target.value)}
                  placeholder="Player 2..."
                  className="w-full px-4 py-2 bg-slate-900/80 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff007f] focus:ring-1 focus:ring-[#ff007f] transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !handle1.trim() || !handle2.trim()}
                  className="px-4 py-2 shrink-0 bg-[#ff007f]/80 hover:bg-[#ff007f] disabled:opacity-40 disabled:cursor-not-allowed rounded-r-xl text-xs font-semibold text-white transition-all glow-pink border-y border-r border-[#ff007f]"
                >
                  {loading ? '...' : 'Duel'}
                </button>
              </div>
            ) : (
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[var(--color-neon-cyan)] transition-colors" />
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="Enter Codeforces handle..."
                  className="w-full pl-10 pr-24 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--color-neon-cyan)] focus:ring-1 focus:ring-[var(--color-neon-cyan)] transition-all glow-cyan-border"
                />
                <button
                  type="submit"
                  disabled={loading || !handle.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--color-neon-purple)] hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-white transition-all glow-purple"
                >
                  {loading ? '...' : 'Analyze'}
                </button>
              </div>
            )}
          </form>

          {/* GitHub link */}
          <a
            href="https://github.com/sagar777-900er/cf-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-white transition-colors shrink-0"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
