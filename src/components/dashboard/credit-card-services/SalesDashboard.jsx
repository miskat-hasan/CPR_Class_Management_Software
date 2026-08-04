"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";

const CustomLabel = ({ x, y, value }) => {
  if (value === 750) {
    return (
      <text
        x={x}
        y={y - 15}
        fill="#B70000"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
      >
        $10,000
      </text>
    );
  }
  return null;
};

export const SalesDashboard = ({ data }) => {
  const chartData = useMemo(() => {
    return (
      data?.chart_data?.map(item => ({
        day: String(item.day).padStart(2, "0"),
        sales: Number(item.volume),
      })) || []
    );
  }, [data]);

  return (
    <div className="bg-white dark:bg-black rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-red-800">
          Sales Overview
        </h2>
      </div>

      <div className="h-[250px] sm:h-[350px]">
        <SalesChart data={chartData} />
      </div>
    </div>
  );
};

const SalesChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#B70000" stopOpacity={0.4} />
          <stop offset="95%" stopColor="#FF9A9A" stopOpacity={0.1} />
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />

      <XAxis
        dataKey="day"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: "#666" }}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: "#666" }}
      />

      <Tooltip
        contentStyle={{
          borderRadius: "8px",
          borderColor: "#eee",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
        formatter={value => [`$${Number(value).toLocaleString()}`, "Sales"]}
      />

      <Area
        type="monotone"
        dataKey="sales"
        stroke="#B70000"
        strokeWidth={2.5}
        fill="url(#chartGradient)"
        dot={{
          r: 4,
          fill: "#B70000",
          stroke: "#fff",
          strokeWidth: 2,
        }}
        activeDot={{
          r: 6,
          fill: "#B70000",
          stroke: "#fff",
          strokeWidth: 2,
        }}
      >
        <Label content={<CustomLabel />} />
      </Area>
    </AreaChart>
  </ResponsiveContainer>
);
