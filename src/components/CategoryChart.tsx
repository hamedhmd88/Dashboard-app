"use client";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Category } from "../../public/data/dataTypes";
import { motion } from "framer-motion";

const COLORS = ["#FF6B6B", "#4D96FF", "#FFD166", "#06D6A0", "#A29BFE"];

const CategoryChart = () => {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [isSmallMediaScreen, setIsSmallMediaScreen] = useState<boolean>(false);
  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setCategoryData(data.categories));
  }, []);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsSmallMediaScreen(window.innerWidth <= 768);
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const outerRadius = isSmallMediaScreen ? 60 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
    >
      <h2 className="text-base md:text-lg font-medium mb-4 text-gray-100 text-center md:text-right">
        مقادیر دسته بندی
      </h2>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={outerRadius}
              dataKey="value"
              label={({ name, percent, x, y }) => (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="right"
                  style={{
                    fill: "#ffff",
                  }}
                >
                  {`${name} ${(percent * 100).toFixed(0)}%`}
                </text>
              )}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderBlock: "#4b5563",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "14px",
                direction: "rtl",
                textAlign: "right",
              }}
              itemStyle={{
                color: "#e5e7eb",
                direction: "rtl",
                fontFamily: "Vazirmatn, Tahoma, Arial",
              }}
            />
            <Legend
              iconType="circle"
              layout="horizontal"
              align="center"
              wrapperStyle={{
                fontSize: 14,
                direction: "rtl",
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
              }}
              formatter={(value) => (
                <span style={{ marginRight: 8 }}>{value}</span> // فاصله بین دایره و متن
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryChart;
