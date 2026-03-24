import { Trophy, TrendingUp, Star, Hash, Swords, Crown } from 'lucide-react';

const RANK_STYLES = {
  newbie: { color: '#808080', bg: 'rgba(128,128,128,0.1)' },
  pupil: { color: '#008000', bg: 'rgba(0,128,0,0.1)' },
  specialist: { color: '#03a89e', bg: 'rgba(3,168,158,0.1)' },
  expert: { color: '#0000ff', bg: 'rgba(0,0,255,0.1)' },
  'candidate master': { color: '#aa00aa', bg: 'rgba(170,0,170,0.1)' },
  master: { color: '#ff8c00', bg: 'rgba(255,140,0,0.1)' },
  'international master': { color: '#ff8c00', bg: 'rgba(255,140,0,0.1)' },
  grandmaster: { color: '#ff0000', bg: 'rgba(255,0,0,0.1)' },
  'international grandmaster': { color: '#ff0000', bg: 'rgba(255,0,0,0.1)' },
  'legendary grandmaster': { color: '#ff0000', bg: 'rgba(255,0,0,0.1)' },
};

function StatCard({ icon: Icon, label, value, iconColor, delay }) {
  return (
    <div className={`glass-card animate-fade-in animate-fade-in-delay-${delay} flex flex-col gap-3 p-4`}>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center glow-cyan"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight font-mono text-white">
        {value}
      </p>
    </div>
  );
}

export default function UserStats({ userData, submissions }) {
  if (!userData) return null;

  const rank = userData.rank || 'unranked';
  const rankStyle = RANK_STYLES[rank.toLowerCase()] || RANK_STYLES.newbie;
  const solvedCount = submissions?.solvedCount || 0;
  const bestRating = submissions?.bestRating || 'N/A';

  return (
    <div className="animate-fade-in">
      {/* Profile Header */}
      <div className="glass-card mb-4 flex items-center gap-5 p-5">
        <div className="relative">
          <img
            src={userData.titlePhoto?.startsWith('//') ? `https:${userData.titlePhoto}` : userData.titlePhoto}
            alt={userData.handle}
            className="w-16 h-16 rounded-2xl object-cover border-2"
            style={{ borderColor: rankStyle.color, boxShadow: `0 0 15px ${rankStyle.color}80` }}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${userData.handle}&background=16161f&color=f0f0f5&size=64`;
            }}
          />
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0a0f1d]"
            style={{ backgroundColor: rankStyle.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold tracking-tight truncate text-white">{userData.handle}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
              style={{ color: rankStyle.color, backgroundColor: rankStyle.color + '20' }}
            >
              {rank}
            </span>
            {userData.organization && (
              <span className="text-xs text-slate-400 truncate">
                {userData.organization}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={TrendingUp}
          label="Current Rating"
          value={userData.rating ?? 'Unrated'}
          iconColor="#00f0ff"
          delay={1}
        />
        <StatCard
          icon={Crown}
          label="Max Rating"
          value={userData.maxRating ?? 'Unrated'}
          iconColor="#fbbf24"
          delay={2}
        />
        <StatCard
          icon={Hash}
          label="Problems Solved"
          value={solvedCount}
          iconColor="#22c55e"
          delay={3}
        />
        <StatCard
          icon={Swords}
          label="Best Problem"
          value={bestRating}
          iconColor="#ff007f"
          delay={4}
        />
      </div>
    </div>
  );
}
