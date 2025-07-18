"use client";

// ایمپورت کردن کتابخانه‌های مورد نیاز
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

// تعریف رنگ‌های مورد استفاده در نمودار دایره‌ای
// هر رنگ مربوط به یک دسته‌بندی است: گوشی هوشمند (قرمز)، لپتاپ (آبی)، مبلمان (نارنجی)، زیبایی (سبزآبی)، لوازم جانبی بازی (بنفش)
const COLORS = ["#FF6B6B", "#4D96FF", "#FFD166", "#06D6A0", "#A29BFE"];

const CategoryChart = () => {
  // تعریف state برای نگهداری داده‌های دسته‌بندی و وضعیت صفحه نمایش
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [isSmallMediaScreen, setIsSmallMediaScreen] = useState<boolean>(false);

  // دریافت داده‌ها از فایل JSON در هنگام بارگذاری کامپوننت
  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setCategoryData(data.categories));
  }, []);

  // بررسی سایز صفحه نمایش و به‌روزرسانی state مربوطه
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

  // تنظیم شعاع خارجی نمودار بر اساس سایز صفحه
  const outerRadius = isSmallMediaScreen ? 60 : 90;

  // تابع سفارشی برای رندر کردن برچسب‌های نمودار
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
    fill,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);

    // محاسبه موقعیت خطوط راهنما و متن
    const x1 = cx + (outerRadius + 5) * cos;
    const y1 = cy + (outerRadius + 5) * sin;
    const x2 = cx + (outerRadius + 25) * cos;
    const y2 = cy + (outerRadius + 25) * sin;
    const textFinalX = cx + (outerRadius + 40) * cos;
    const textFinalY = cy + (outerRadius + 40) * sin;

    // تعیین نقطه شروع متن برای پشتیبانی از RTL
    const anchor = cos >= 0 ? "end" : "start";

    return (
      <g>
        {/* رسم خط راهنما */}
        <path d={`M${x1},${y1}L${x2},${y2}`} stroke={fill} fill="none" />
        {/* نمایش متن برچسب */}
        <text
          x={textFinalX}
          y={textFinalY}
          direction="rtl"
          textAnchor={anchor}
          dominantBaseline="middle"
          fill={fill}
          style={{
            fontSize: "15px",
          }}
        >
          {`${name} %${Math.round(percent * 100)}`}
        </text>
      </g>
    );
  };

  return (
    // کانتینر اصلی با انیمیشن ورودی
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 text-right"
    >
      {/* عنوان نمودار */}
      <h2 className="text-base md:text-lg font-medium mb-4 text-[var(--text-secondary)] text-center md:text-right">
        دسته بندی محصولات
      </h2>
      {/* کانتینر نمودار */}
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* تنظیمات نمودار دایره‌ای */}
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={outerRadius}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {/* رندر کردن بخش‌های نمودار با رنگ‌های مختلف */}
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {/* تنظیمات تولتیپ */}
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
                fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif",
              }}
            />
            {/* تنظیمات راهنمای نمودار */}
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
                marginTop: "20px",
              }}
              formatter={(value) => (
                <span style={{ marginRight: 8, direction: "rtl" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryChart;


