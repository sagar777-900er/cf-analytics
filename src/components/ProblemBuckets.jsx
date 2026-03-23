import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const BAR_COLORS = [
  '#808080', '#808080',   // 0-400
  '#008000', '#008000',   // 400-800
  '#03a89e', '#03a89e',   // 800-1200
  '#0000ff', '#0000ff',   // 1200-1600
  '#aa00aa', '#aa00aa',   // 1600-2000
  '#ff8c00', '#ff8c00',   // 2000-2400
  '#ff0000', '#ff0000',   // 2400-2800
  '#ff0000', '#ff0000',   // 2800+
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl px-4 py-2.5 shadow-2xl">
      <p className="text-xs font-semibold font-mono">Rating {d.range}</p>
      <p className="text-lg font-bold font-mono text-[var(--color-accent)]">
        {d.count} <span className="text-xs font-normal text-[var(--color-text-muted)]">solved</span>
      </p>
    </div>
  );
}

export default function ProblemBuckets({ buckets }) {
  if (!buckets?.length) return null;

  return (
    <div className="bento-card animate-fade-in animate-fade-in-delay-4">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[rgba(244,114,182,0.1)] flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-[var(--color-pink)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Rating Distribution</h3>
          <p className="text-xs text-[var(--color-text-muted)]">Solved by rating bucket</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="range"
              tick={{ fill: 'var(--color-text-muted)', fontSize: 9 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
              angle={-25}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {buckets.map((entry, i) => (
                <Cell key={entry.range} fill={BAR_COLORS[i] || '#7c5cfc'} fillOpacity={0.75} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
