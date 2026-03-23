import Header from './components/Header';
import UserStats from './components/UserStats';
import RatingChart from './components/RatingChart';
import TagMastery from './components/TagMastery';
import TrainingRange from './components/TrainingRange';
import ProblemBuckets from './components/ProblemBuckets';
import Watchlist from './components/Watchlist';
import LoadingSpinner from './components/LoadingSpinner';
import { useCodeforcesData } from './hooks/useCodeforcesData';
import { Zap, Code2, BarChart3, Target } from 'lucide-react';

function App() {
  const {
    userData,
    submissions,
    ratingHistory,
    training,
    loading,
    error,
    currentHandle,
    analyze,
  } = useCodeforcesData();

  const hasData = userData || submissions || ratingHistory;

  return (
    <div className="min-h-screen">
      <Header onAnalyze={analyze} loading={loading} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] text-[var(--color-red)] text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Empty State */}
        {!loading && !hasData && !error && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] flex items-center justify-center shadow-lg glow-purple">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                <span className="gradient-text">CF Analytics</span>
              </h1>
              <p className="text-[var(--color-text-secondary)] max-w-md text-sm leading-relaxed">
                Enter a Codeforces handle above to visualize your competitive programming journey with beautiful charts and insights.
              </p>
            </div>
            <div className="flex items-center gap-6 text-[var(--color-text-muted)] text-xs">
              <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Rating Charts</span>
              <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Tag Analysis</span>
              <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> Smart Training</span>
            </div>
          </div>
        )}

        {/* Dashboard */}
        {!loading && hasData && (
          <div className="space-y-6">
            {/* User Stats */}
            <UserStats userData={userData} submissions={submissions} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RatingChart ratingHistory={ratingHistory} />
              <TagMastery tagStats={submissions?.tagStats} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <ProblemBuckets buckets={submissions?.buckets} />
              </div>
              <div className="space-y-4">
                <TrainingRange training={training} />
                <Watchlist currentHandle={currentHandle} onAnalyze={analyze} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-muted)]">
            CF Analytics — Built with React, Recharts &amp; Tailwind
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Data from <a href="https://codeforces.com/apiHelp" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">Codeforces API</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
