import {
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";

const data = [
  { value: 2 },
  { value: 4 },
  { value: 3 },
  { value: 6 },
  { value: 5 },
  { value: 8 },
  { value: 7 },
];

export function WeeklyLineChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="mb-1 text-sm text-muted">
        Wykonane treningi
      </p>

      <h2 className="text-3xl font-bold text-white">
        24
      </h2>

      <p className="mb-6 text-sm text-muted">
        w tym miesiącu
      </p>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}