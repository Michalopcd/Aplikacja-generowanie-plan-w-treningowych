import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import type { DashboardChartDataItem } from "../utils/dashboardStats";

import { Card } from "../../../ui/Card";

type DashboardStatsChartType = "bar" | "donut" | "activity" | "progress";

type DashboardStatsCardProps = {
  title: string;
  value: string;
  description: string;
  chartType: DashboardStatsChartType;
  chartData: DashboardChartDataItem[];
};

const CHART_COLORS = {
  primary: "#7c3aed",
  muted: "#3f3f46",
};

const renderChart = (
  chartType: DashboardStatsChartType,
  chartData: DashboardChartDataItem[],
) => {
  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height={70}>
        <BarChart data={chartData}>
          <XAxis dataKey="label" hide />

          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) {
                return null;
              }

              const value = Number(payload[0].value);

              if (value === 0) {
                return null;
              }

              const label = payload[0].payload.label;

              return (
                <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-white">
                  <p className="font-semibold">{label}</p>

                  <p className="mt-1 text-muted">
                    {value} {value === 1 ? "trening" : "treningi"}
                  </p>
                </div>
              );
            }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 8, 8]}
            fill={CHART_COLORS.primary}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "activity") {
    return (
      <div className="flex h-[70px] items-center justify-between gap-2">
        {chartData.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                item.value === 1
                  ? "bg-primary text-white"
                  : "bg-zinc-800 text-muted"
              }`}
            >
              {item.value === 1 ? "✓" : "–"}
            </div>

            <span className="text-xs text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (chartType === "progress") {
    const progress = chartData[0]?.value ?? 0;

    return (
      <div className="flex h-[70px] flex-col justify-center">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Postęp tygodnia</span>

          <span>{progress}%</span>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={86}>
      <PieChart>
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "12px",
            color: "#ffffff",
            fontSize: "12px",
          }}
        />

        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          innerRadius={26}
          outerRadius={38}
          paddingAngle={3}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={entry.label}
              fill={index === 0 ? CHART_COLORS.primary : CHART_COLORS.muted}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export const DashboardStatsCard = ({
  title,
  value,
  description,
  chartType,
  chartData,
}: DashboardStatsCardProps) => {
  return (
    <Card className="bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>

          <p className="mt-2 text-3xl font-bold text-white">{value}</p>

          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>

        {chartType === "donut" && (
          <div className="h-24 w-24 shrink-0">
            {renderChart(chartType, chartData)}
          </div>
        )}
      </div>

      {chartType !== "donut" && (
        <div className="mt-4 h-[70px]">{renderChart(chartType, chartData)}</div>
      )}
    </Card>
  );
};
