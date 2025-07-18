import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { YearlySales } from "../../../public/data/dataTypes";
import { PieLabelRenderProps } from 'recharts';

const COLORS = ["#6366f1", "#22c55e", "#f59e42", "#f44336", "#9c27b0"];

// Custom label for Pie slices (at the end of the label line)
const renderCustomLabel = ({ x, y, value }: PieLabelRenderProps) => (
  <text
    x={x}
    y={y}
    fill="var(--foreground)"
    textAnchor="middle"
    dominantBaseline="central"
    fontSize={14}
    fontWeight="bold"
    style={{ textShadow: "0 1px 4px #23272f" }}
  >
    {Number(value).toLocaleString()}
  </text>
);

const YearlySalesDonutChart: React.FC = () => {
  const [yearlySales, setYearlySales] = useState<YearlySales[]>([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setYearlySales(data.yearlySales || []));
  }, []);

  if (yearlySales.length < 2) return null;

  const thisYear = yearlySales[yearlySales.length - 1];
  const lastYear = yearlySales[yearlySales.length - 2];

  // برای نمایش دونات درآمد
  const revenueData = yearlySales.map((y) => ({ name: y.year, value: y.revenue }));
  // برای نمایش دونات سود
  const profitData = yearlySales.map((y) => ({ name: y.year, value: y.profit }));

  // درصد رشد درآمد و سود نسبت به سال قبل
  const revenueGrowth = (((thisYear.revenue - lastYear.revenue) / lastYear.revenue) * 100).toFixed(1);
  const profitGrowth = (((thisYear.profit - lastYear.profit) / lastYear.profit) * 100).toFixed(1);

  return (
    <motion.div
      className="bg-[var(--component-bg)] shadow-2xl rounded-2xl p-6 border border-[#23272f] mx-2 md:mx-0 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-base md:text-2xl font-medium mb-4 text-[var(--text-secondary)] text-center md:text-right">
        مقایسه درآمد و سود سال جاری با سال‌های قبل
      </h2>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="w-full md:w-1/2">
          <h3 className="text-center text-lg font-semibold text-indigo-400 mb-2">درآمد سالانه</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="58%"
                innerRadius={60}
                outerRadius={90}
                fill="#6366f1"
                label={renderCustomLabel}
                labelLine={true}
              >
                {revenueData.map((entry, idx) => (
                  <Cell key={`cell-revenue-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props) => [value.toLocaleString(), `سال ${props && props.payload ? props.payload.name : name}`]}
                contentStyle={{ fontSize: "16px", backgroundColor: "#23272f", color: "#fff" }}
              />
             
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2">
          <h3 className="text-center text-lg font-semibold text-green-400 mb-2">سود سالانه</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={profitData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="55%"
                innerRadius={60}
                outerRadius={90}
                fill="#22c55e"
                label={renderCustomLabel}
                labelLine={true}
                // حذف label برای جلوگیری از شلوغی و تداخل اعداد
              >
                {profitData.map((entry, idx) => (
                  <Cell key={`cell-profit-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props) => [value.toLocaleString(), `سال ${props && props.payload ? props.payload.name : name}`]}
                contentStyle={{ fontSize: "16px", backgroundColor: "#23272f", color: "#fff" }}
              />
              
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mt-8">
        <div className="bg-[#23272f] rounded-xl px-6 py-4 text-center text-gray-200 text-lg font-semibold shadow">
          رشد درآمد نسبت به سال قبل: <span className="text-indigo-400">{revenueGrowth}%</span>
        </div>
        <div className="bg-[#23272f] rounded-xl px-6 py-4 text-center text-gray-200 text-lg font-semibold shadow">
          رشد سود نسبت به سال قبل: <span className="text-green-400">{profitGrowth}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default YearlySalesDonutChart;

