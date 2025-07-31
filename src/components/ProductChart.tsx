"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductPerformance } from "../../public/data/dataTypes";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts";
import { useProductPerformanceData } from "@/hooks/useDashboardData";

const ProductPerformanceChart = () => {
  // const [productPerformanceData, setProductPerformanceData] = useState<
  //   ProductPerformance[]
  // >([]);
  const { productPerformance, isLoading, error } = useProductPerformanceData();

  // useEffect(() => {
  //   fetch("/data/data.json")
  //     .then((res) => res.json())
  //     .then((data) => setProductPerformanceData(data.productPerformance));
  // }, []);

  // --- تغییرات اینجا ---

  // ۱. ترجمه dataKey ها برای نمایش در Legend
  const getTranslatedLabel = (value: string | number): string | number => {
    switch (value) {
      case "Retention":
        return "حفظ مشتری";
      case "Revenue":
        return "درآمد";
      case "Profit":
        return "سود";
      default:
        return value;
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="dashboard-card p-4 md:p-6 mx-2 md:mx-0"
      >
        <h2 className="text-base md:text-2xl font-medium mb-4 text-[var(--text-secondary)] text-center md:text-right">
        وضعیت محصولات
        </h2>
        <div className="h-64 md:h-80 flex items-center justify-center">
          <div className="animate-pulse text-[var(--text-secondary)]">
            در حال بارگذاری...
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="dashboard-card p-4 md:p-6 mx-2 md:mx-0"
      >
        <h2 className="text-base md:text-2xl font-medium mb-4 text-[var(--text-secondary)] text-center md:text-right">
        وضعیت محصولات
        </h2>
        <div className="h-64 md:h-80 flex items-center justify-center text-red-500">
          خطا در بارگذاری داده‌ها
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-[var(--component-bg)] backdrop-blur-lg shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 text-right" // اضافه کردن text-right برای RTL
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="text-base md:text-xl font-semibold text-[var(--text-secondary)] mb-4 text-center md:text-right">
        وضعیت محصولات
      </h2>
      <div className="w-full h-64 md:h-72">
        <ResponsiveContainer>
          <BarChart
            data={productPerformance}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }} // افزایش margin-left برای فضای YAxis
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 12, fill: "#9ca3af" }} // اضافه کردن fill برای رنگ متن تیک‌ها
              interval="preserveStartEnd"
              // برای نمایش نام فارسی در محور X اگر نیاز بود
              // tickFormatter={(value) => value} // اگر نام‌ها در data.json فارسی هستند نیازی به تغییر نیست
            />
            <YAxis
              stroke="#9ca3af"
              tick={{
                fontSize: 12,
                fill: "#9ca3af", // رنگ متن تیک‌ها
                dx: -25, // <--- جابجایی اعداد محور Y به سمت چپ (5 پیکسل)
              }}
              width={50} // <--- افزایش عرض محور Y برای جای دادن لیبل‌ها (مثلاً 50 پیکسل)
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f1f1f",
                borderColor: "#4b5563",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "12px",
                direction: "rtl", // RTL برای Tooltip
                textAlign: "right",
              }}
              itemStyle={{
                color: "#e5e7eb",
                direction: "rtl", // RTL برای آیتم‌های Tooltip
              }}
              labelStyle={{
                direction: "rtl", // RTL برای لیبل Tooltip
                textAlign: "right",
              }}
              // برای نمایش ترجمه در Tooltip (اختیاری)
              formatter={(value, name) => [value, getTranslatedLabel(name)]}
            />
            <Legend
              wrapperStyle={{
                fontSize: 12,
                direction: "rtl", // RTL برای Legend
                textAlign: "right",
                display: "flex", // برای کنترل بهتر چیدمان
                justifyContent: "center", // برای وسط چین کردن لجند
                marginTop: "10px", // <--- اضافه کردن فاصله از نمودار
              }}
              // این formatter برای ترجمه و افزودن فاصله به کار می‌رود
              formatter={(value, entry) => (
                <span
                  style={{
                    marginRight: 10, // <--- فاصله بین مربع و متن (10 پیکسل)
                    marginLeft: 0, // در RTL، نیازی به marginLeft نیست
                    color: entry.color, // رنگ متن را با رنگ مربع یکسان می‌کند
                  }}
                >
                  {getTranslatedLabel(value)}
                </span>
              )}
            />
            <Bar
              dataKey="Retention"
              fill="#ff7043"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="Revenue"
              fill="#29b6f6"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="Profit"
              fill="#66bb6a"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProductPerformanceChart;
