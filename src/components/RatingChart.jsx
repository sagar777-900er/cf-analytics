import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { TrendingUp } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;
  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-400 mb-1">{d.contestName}</p>
      <div className="flex items-baseline gap-3">
        <span className="text-lg font-bold font-mono text-white">{d.newRating}</span>
        <span
          className="text-xs font-semibold font-mono"
          style={{ color: d.newRating >= d.oldRating ? '#22c55e' : '#ef4444' }}
        >
          {d.newRating >= d.oldRating ? '+' : ''}{d.newRating - d.oldRating}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 mt-1">Rank #{d.rank} · {d.date}</p>
    </div>
  );
}

export default function RatingChart({ ratingHistory }) {
  if (!ratingHistory?.length) return null;

  const minRating = Math.min(...ratingHistory.map((d) => d.newRating));
  const maxRating = Math.max(...ratingHistory.map((d) => d.newRating));
  const padding = 100;

  return (
    <div className="glass-card animate-fade-in animate-fade-in-delay-2 p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[rgba(0,240,255,0.1)] flex items-center justify-center glow-cyan">
          <TrendingUp className="w-4 h-4 text-[#00f0ff]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Rating Trajectory</h3>
          <p className="text-xs text-slate-400">{ratingHistory.length} contests</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ratingHistory} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minRating - padding, maxRating + padding]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="newRating"
              stroke="#00f0ff"
              strokeWidth={2}
              fill="url(#ratingGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#00f0ff',
                stroke: '#0f0f0f',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
