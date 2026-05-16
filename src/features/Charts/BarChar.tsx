import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

const data = [
  { day: "Pn", value: 4 },
  { day: "Wt", value: 6 },
  { day: "Śr", value: 3 },
  { day: "Czw", value: 8 },
  { day: "Pt", value: 5 },
  { day: "Sob", value: 9 },
  { day: "Nd", value: 7 },
];

export function ActivityBarChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="mb-1 text-sm text-muted">
        Aktywność tygodniowa
      </p>

      <h2 className="mb-6 text-lg font-semibold text-white">
        42 treningi
      </h2>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a" }}
            />

            <Bar
              dataKey="value"
              fill="#22c55e"
              radius={[10, 10, 0, 0]}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}