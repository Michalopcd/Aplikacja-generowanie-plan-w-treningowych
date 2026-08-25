import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card } from "../../../ui/Card";
import type { DashboardChartDataItem } from "../utils/dashboardStats";

type DashboardStatsChartType = "line" | "bar" | "donut";

type DashboardStatsCardProps = {
  title: string;
  value: string;
  description: string;
  chartType: DashboardStatsChartType;
  chartData: DashboardChartDataItem[];
};

const chartColors = {
  primary: "#7c3aed",
  muted: "#3f3f46",
};

const renderChart = (
  chartType: DashboardStatsChartType,
  chartData: DashboardChartDataItem[],
) => {
  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={70}>
        <LineChart data={chartData}>
          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke={chartColors.primary}
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height={70}>
        <BarChart data={chartData}>
          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "12px",
            }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 8, 8]}
            fill={chartColors.primary}
          />
        </BarChart>
      </ResponsiveContainer>
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
              fill={
                index === 0
                  ? chartColors.primary
                  : chartColors.muted
              }
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
    <Card className="bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>

        {chartType === "donut" && (
          <div className="h-24 w-24 shrink-0">
            {renderChart(chartType, chartData)}
          </div>
        )}
      </div>

      {chartType !== "donut" && (
        <div className="mt-5 h-[70px]">
          {renderChart(chartType, chartData)}
        </div>
      )}
    </Card>
  );
};