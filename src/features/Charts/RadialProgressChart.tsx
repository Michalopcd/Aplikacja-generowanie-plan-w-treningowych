import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "progress",
    value: 72,
    fill: "#7c3aed",
  },
];

export function RadialProgressChart() {
  return (
    <div className="w-80 rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="mb-4 text-sm text-muted">
        Postęp planu
      </p>

      <div className="relative h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" cornerRadius={20} background />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            72%
          </span>
        </div>
      </div>
    </div>
  );
}