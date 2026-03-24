import Header from './components/Header';
import UserStats from './components/UserStats';
import RatingChart from './components/RatingChart';
import TagMastery from './components/TagMastery';
import TrainingRange from './components/TrainingRange';
import ProblemBuckets from './components/ProblemBuckets';
import Watchlist from './components/Watchlist';
import LoadingSpinner from './components/LoadingSpinner';
import SWOTAnalysis from './components/SWOTAnalysis';
import HeadToHead from './components/HeadToHead';
import VirtualContest from './components/VirtualContest';
import { useCodeforcesData } from './hooks/useCodeforcesData';
import { useH2HData } from './hooks/useH2HData';
import { Zap, Code2, BarChart3, Target, Users } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [isH2HMode, setIsH2HMode] = useState(false);

  // Single User Data
  const {
    userData, submissions, ratingHistory, training,
    loading: loadingSingle, error: errorSingle, currentHandle, analyze
  } = useCodeforcesData();

  // Head to Head Data
  const {
    dataUser1, dataUser2,
    loading: loadingH2H, error: errorH2H, analyzeH2H
  } = useH2HData();

  const loading = isH2HMode ? loadingH2H : loadingSingle;
  const error = isH2HMode ? errorH2H : errorSingle;
  const hasDataSingle = userData || submissions || ratingHistory;
  const hasDataH2H = dataUser1 && dataUser2;
  const hasData = isH2HMode ? hasDataH2H : hasDataSingle;

  return (
    <div className="min-h-screen">
      <Header 
        onAnalyze={analyze} 
        onAnalyzeH2H={analyzeH2H} 
        loading={loading} 
        isH2HMode={isH2HMode} 
        setIsH2HMode={setIsH2HMode} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-medium animate-fade-in glass-card">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Empty State */}
        {!loading && !hasData && !error && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient flex items-center justify-center shadow-lg glow-purple">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                <span className="gradient-text">CF Analytics</span>
              </h1>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                Enter a Codeforces handle above to visualize your competitive programming journey with beautiful charts and insights.
              </p>
            </div>
            <div className="flex items-center gap-6 text-slate-500 text-xs">
              <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Rating Charts</span>
              <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Tag Analysis</span>
              <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> Smart Training</span>
              <span className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setIsH2HMode(true)}
                  className="px-4 py-2 rounded-xl bg-[#ff007f]/10 text-[#ff007f] font-semibold border border-[#ff007f]/30 hover:bg-[#ff007f]/20 transition-all text-xs"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Try Head-to-Head Mode
                </button>
              </span>
            </div>
          </div>
        )}

        {/* Dashboard / H2H View */}
        {!loading && hasData && (
          <div className="space-y-6">
            {isH2HMode ? (
              <HeadToHead dataUser1={dataUser1} dataUser2={dataUser2} />
            ) : (
              <>
                {/* Exportable Profile Card Area */}
                <div id="export-container" className="p-4 -mx-4 rounded-3xl bg-[var(--color-space-bg)] border border-transparent">
                  {/* User Stats */}
                  <UserStats userData={userData} submissions={submissions} />

                  {/* SWOT Analysis */}
                  <SWOTAnalysis 
                    userData={userData} 
                    submissions={submissions} 
                    training={training} 
                    ratingHistory={ratingHistory} 
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RatingChart ratingHistory={ratingHistory} />
                  <TagMastery tagStats={submissions?.tagStats} />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-4">
                    <ProblemBuckets buckets={submissions?.buckets} />
                    <VirtualContest currentHandle={currentHandle} />
                  </div>
                  <div className="space-y-4">
                    <TrainingRange training={training} />
                    <Watchlist currentHandle={currentHandle} onAnalyze={analyze} userData={userData} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 glass-card rounded-none border-b-0 border-l-0 border-r-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            CF Analytics — Built with React, Recharts &amp; Tailwind
          </p>
          <p className="text-xs text-slate-500">
            Data from <a href="https://codeforces.com/apiHelp" target="_blank" rel="noopener noreferrer" className="text-[var(--color-neon-cyan)] hover:text-white transition-colors">Codeforces API</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
