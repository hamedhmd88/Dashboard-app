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

const ProductPerformanceChart = () => {
  const [productPerformanceData, setProductPerformanceData] = useState<
    ProductPerformance[]
  >([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setProductPerformanceData(data.productPerformance));
  }, []);

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

  return (
    <motion.div
      className="bg-[#0A0A0A] backdrop-blur-lg shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 text-right" // اضافه کردن text-right برای RTL
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="text-base md:text-xl font-semibold text-gray-100 mb-4 text-center md:text-right">
        وضعیت محصولات
      </h2>
      <div className="w-full h-64 md:h-72">
        <ResponsiveContainer>
          <BarChart
            data={productPerformanceData}
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
