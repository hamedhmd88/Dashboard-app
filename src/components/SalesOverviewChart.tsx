import React, { useEffect, useState } from "react";
import { Sale } from "../../public/data/dataTypes";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { motion } from "framer-motion";

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);

  useEffect(() => {
    fetch("data/data.json")
      .then((res) => res.json())
      .then((data) => setSalesData(data.sales));
  }, []);

  return (
    <motion.div
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-base md:text-2xl font-medium mb-4 text-[var(--text-secondary)] text-center md:text-right">
        نمای کلی فروش
      </h2>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{
                fontSize: 12,
                dx: -25, // <--- اینجا برای جابجایی به سمت چپ
                fill: "#9ca3af", // رنگ متن تیک‌ها
              }}
              width={40} // این width فضای اشغال شده توسط محور را مشخص می‌کند
            />{" "}
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4b5563",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#9c27b0"
              strokeWidth={3}
              dot={{ fill: "#9c27b0", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;


