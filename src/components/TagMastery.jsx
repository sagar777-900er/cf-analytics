import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { Target } from 'lucide-react';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card rounded-xl px-4 py-2.5 shadow-2xl">
      <p className="text-xs font-semibold text-white">{d.tag}</p>
      <p className="text-lg font-bold font-mono text-[#b026ff]">{d.count}</p>
      <p className="text-[10px] text-slate-400">problems solved</p>
    </div>
  );
}

export default function TagMastery({ tagStats }) {
  if (!tagStats?.length) return null;

  const maxCount = Math.max(...tagStats.map((t) => t.count));

  return (
    <div className="glass-card animate-fade-in animate-fade-in-delay-3 p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[rgba(176,38,255,0.1)] flex items-center justify-center glow-purple">
          <Target className="w-4 h-4 text-[#b026ff]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Tag Mastery</h3>
          <p className="text-xs text-slate-400">Top {tagStats.length} tags</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={tagStats} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis
              dataKey="tag"
              tick={{ fill: '#94a3b8', fontSize: 9 }}
            />
            <PolarRadiusAxis
              domain={[0, maxCount]}
              tick={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Problems"
              dataKey="count"
              stroke="#b026ff"
              fill="#b026ff"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Tag List */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {tagStats.map((t) => (
          <span
            key={t.tag}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium bg-[#1e293b]/50 text-slate-300 border border-white/10"
          >
            {t.tag} <span className="text-[#b026ff]">{t.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
