import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TYPE_META } from '../../lib/listingTypes';

const ACTION_COLORS = { sell: '#1E5A43', swap: '#3E5C8A', donate: '#E9A23B', repair: '#B65A35' };
const tooltipStyle = { borderRadius: 12, border: '1px solid #E6E2D8', boxShadow: '0 4px 16px rgba(18,24,21,0.08)', fontSize: 13 };

export function MonthlyChart({ data }) {
  return (
    <div className="h-72" role="img" aria-label="Area chart of kilograms diverted per month">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="kgFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3C7D61" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3C7D61" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#E6E2D8" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#5E6A64', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#5E6A64', fontSize: 12 }} unit=" kg" width={56} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, 'Diverted (est.)']} />
          <Area type="monotone" dataKey="kg" stroke="#1E5A43" strokeWidth={2} fill="url(#kgFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActionDonut({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const rows = data.map((d) => ({ ...d, name: TYPE_META[d.action].label }));
  return (
    <div>
      <div className="relative h-56" role="img" aria-label="Donut chart of completed items by action type">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={total ? rows : [{ name: 'None', count: 1 }]} dataKey="count" innerRadius={62} outerRadius={90} paddingAngle={total ? 3 : 0} stroke="none">
              {(total ? rows : [{ action: 'none' }]).map((r) => <Cell key={r.action} fill={ACTION_COLORS[r.action] || '#E6E2D8'} />)}
            </Pie>
            {total > 0 && <Tooltip contentStyle={tooltipStyle} />}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="num font-display text-3xl">{total}</span>
          <span className="text-xs text-ink-muted">completed</span>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {rows.map((r) => (
          <li key={r.action} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: ACTION_COLORS[r.action] }} />{r.name} <span className="num ml-auto text-ink-muted">{r.count}</span></li>
        ))}
      </ul>
    </div>
  );
}
