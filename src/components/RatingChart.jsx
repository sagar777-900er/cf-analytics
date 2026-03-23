import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { TrendingUp } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-[var(--color-text-muted)] mb-1">{d.contestName}</p>
      <div className="flex items-baseline gap-3">
        <span className="text-lg font-bold font-mono">{d.newRating}</span>
        <span
          className="text-xs font-semibold font-mono"
          style={{ color: d.newRating >= d.oldRating ? 'var(--color-green)' : 'var(--color-red)' }}
        >
          {d.newRating >= d.oldRating ? '+' : ''}{d.newRating - d.oldRating}
        </span>
      </div>
      <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Rank #{d.rank} · {d.date}</p>
    </div>
  );
}

export default function RatingChart({ ratingHistory }) {
  if (!ratingHistory?.length) return null;

  const minRating = Math.min(...ratingHistory.map((d) => d.newRating));
  const maxRating = Math.max(...ratingHistory.map((d) => d.newRating));
  const padding = 100;

  return (
    <div className="bento-card animate-fade-in animate-fade-in-delay-2">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Rating Trajectory</h3>
          <p className="text-xs text-[var(--color-text-muted)]">{ratingHistory.length} contests</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ratingHistory} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minRating - padding, maxRating + padding]}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="newRating"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fill="url(#ratingGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: 'var(--color-accent)',
                stroke: 'var(--color-bg-primary)',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
