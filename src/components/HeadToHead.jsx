import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Swords, Trophy, Target, Hash } from 'lucide-react';

export default function HeadToHead({ dataUser1, dataUser2 }) {
  if (!dataUser1 || !dataUser2) return null;

  const u1 = dataUser1.userData;
  const s1 = dataUser1.submissions;

  const u2 = dataUser2.userData;
  const s2 = dataUser2.submissions;

  // Compile combined radar chart data
  const combinedTags = {};
  if (s1?.tagStats) {
    s1.tagStats.forEach(t => {
      combinedTags[t.tag] = { tag: t.tag, user1Count: t.count, user2Count: 0 };
    });
  }
  if (s2?.tagStats) {
    s2.tagStats.forEach(t => {
      if (combinedTags[t.tag]) {
        combinedTags[t.tag].user2Count = t.count;
      } else {
        combinedTags[t.tag] = { tag: t.tag, user1Count: 0, user2Count: t.count };
      }
    });
  }

  const radarData = Object.values(combinedTags)
    .sort((a, b) => (b.user1Count + b.user2Count) - (a.user1Count + a.user2Count))
    .slice(0, 10); // Top 10 overlapping tags
    
  const maxRadarValue = Math.max(...radarData.map(d => Math.max(d.user1Count, d.user2Count)));

  const StatCompare = ({ label, icon: Icon, val1, val2, invertColor }) => {
    let u1Wins = false;
    let titleColor = "text-slate-400";
    if (val1 !== null && val2 !== null) {
      u1Wins = val1 > val2;
      if (invertColor) u1Wins = !u1Wins;
    }
    
    return (
      <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors">
        <div className="flex-1 text-center font-mono font-bold text-lg">
          <span className={val1 !== null && val1 > val2 ? "text-[#38bdf8] glow-cyan" : "text-white"}>{val1 ?? 'N/A'}</span>
        </div>
        <div className="flex flex-col items-center justify-center px-4 w-32 shrink-0">
          <Icon className="w-4 h-4 text-slate-500 mb-1" />
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</span>
        </div>
        <div className="flex-1 text-center font-mono font-bold text-lg">
          <span className={val2 !== null && val2 > val1 ? "text-[#a78bfa] glow-pink" : "text-white"}>{val2 ?? 'N/A'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 animate-fade-in space-y-6">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[rgba(255,0,127,0.1)] flex items-center justify-center glow-pink border border-[#a78bfa]/30">
          <Swords className="w-6 h-6 text-[#a78bfa]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Head-to-Head</h2>
          <p className="text-sm text-slate-400">Battle of the Coders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Table */}
        <div className="glass-card p-6 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-8 px-4">
            <div className="text-center flex-1">
              <img src={u1.titlePhoto?.startsWith('//') ? `https:${u1.titlePhoto}` : u1.titlePhoto} alt={u1.handle} className="w-16 h-16 mx-auto rounded-xl object-cover border-2 border-[#38bdf8] mb-2 shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
              <h3 className="text-lg font-bold text-white truncate">{u1.handle}</h3>
            </div>
            <div className="mx-4 pb-2 text-2xl font-black text-slate-700 italic">VS</div>
            <div className="text-center flex-1">
              <img src={u2.titlePhoto?.startsWith('//') ? `https:${u2.titlePhoto}` : u2.titlePhoto} alt={u2.handle} className="w-16 h-16 mx-auto rounded-xl object-cover border-2 border-[#a78bfa] mb-2 shadow-[0_0_15px_rgba(255,0,127,0.4)]" />
              <h3 className="text-lg font-bold text-white truncate">{u2.handle}</h3>
            </div>
          </div>
          
          <div className="bg-[#0f0f0f]/50 rounded-xl p-2 border border-white/5">
            <StatCompare label="Rating" icon={Trophy} val1={u1.rating} val2={u2.rating} />
            <StatCompare label="Max Rating" icon={Trophy} val1={u1.maxRating} val2={u2.maxRating} />
            <StatCompare label="Problems Solved" icon={Hash} val1={s1?.solvedCount} val2={s2?.solvedCount} />
            <StatCompare label="Best Problem" icon={Target} val1={s1?.bestRating} val2={s2?.bestRating} />
          </div>
        </div>

        {/* Radar Chart Overlay */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white mb-6 text-center">Tag Mastery Overlap</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="tag" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, maxRadarValue]} tick={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
                <Radar name={u1.handle} dataKey="user1Count" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} strokeWidth={2} />
                <Radar name={u2.handle} dataKey="user2Count" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.4} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
