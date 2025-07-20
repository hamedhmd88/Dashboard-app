// ایمپورت کتابخانه‌های مورد نیاز ری‌اکت و سایر کتابخانه‌ها
import React, { useEffect, useState } from "react";
// ایمپورت کامپوننت‌های مورد نیاز از recharts برای رسم نمودار دایره‌ای
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// ایمپورت framer-motion برای انیمیشن دادن به کامپوننت
import { motion } from "framer-motion";
// ایمپورت نوع داده YearlySales برای تایپ‌اسکریپت
import { YearlySales } from "../../../public/data/dataTypes";
// ایمپورت نوع داده برای پراپرتی‌های لیبل نمودار دایره‌ای
import { PieLabelRenderProps } from "recharts";

// تعریف آرایه‌ای از رنگ‌ها برای بخش‌های مختلف نمودار دایره‌ای
const COLORS = ["#6366f1", "#22c55e", "#f59e42", "#f44336", "#9c27b0"];

// تابعی برای رندر کردن لیبل سفارشی روی هر بخش از نمودار دایره‌ای
const renderCustomLabel = ({ x, y, value }: PieLabelRenderProps) => (
  <text
    x={x} // موقعیت افقی لیبل
    y={y} // موقعیت عمودی لیبل
    fill="var(--foreground)" // رنگ متن لیبل
    textAnchor="middle" // قرارگیری متن در وسط
    dominantBaseline="central" // تراز عمودی متن
    fontSize={14} // اندازه فونت
    fontWeight="bold" // ضخامت فونت
    style={{ textShadow: "0 1px 4px #23272f" }} // سایه برای خوانایی بهتر
  >
    {Number(value).toLocaleString()} // نمایش مقدار به صورت عددی با جداکننده
    هزارگان
  </text>
);

// تعریف کامپوننت اصلی YearlySalesDonutChart
const YearlySalesDonutChart: React.FC = () => {
  // تعریف state برای نگهداری داده‌های فروش سالانه
  const [yearlySales, setYearlySales] = useState<YearlySales[]>([]);

  // استفاده از useEffect برای دریافت داده‌ها از فایل json هنگام بارگذاری کامپوننت
  useEffect(() => {
    fetch("/data/data.json") // درخواست داده از مسیر مشخص شده
      .then((res) => res.json()) // تبدیل پاسخ به json
      .then((data) => setYearlySales(data.yearlySales || [])); // ذخیره داده‌ها در state
  }, []); // فقط یک بار هنگام mount شدن اجرا می‌شود

  // اگر داده کافی وجود نداشت (کمتر از دو سال)، کامپوننت چیزی نمایش نمی‌دهد
  if (yearlySales.length < 2) return null;

  // استخراج داده‌های سال جاری و سال قبل برای مقایسه
  const thisYear = yearlySales[yearlySales.length - 1];
  const lastYear = yearlySales[yearlySales.length - 2];

  // آماده‌سازی داده‌ها برای نمودار دایره‌ای درآمد
  const revenueData = yearlySales.map((y) => ({
    name: y.year,
    value: y.revenue,
  }));
  // آماده‌سازی داده‌ها برای نمودار دایره‌ای سود
  const profitData = yearlySales.map((y) => ({
    name: y.year,
    value: y.profit,
  }));

  // محاسبه درصد رشد درآمد نسبت به سال قبل
  const revenueGrowth = (
    ((thisYear.revenue - lastYear.revenue) / lastYear.revenue) *
    100
  ).toFixed(1);
  // محاسبه درصد رشد سود نسبت به سال قبل
  const profitGrowth = (
    ((thisYear.profit - lastYear.profit) / lastYear.profit) *
    100
  ).toFixed(1);

  // رندر خروجی کامپوننت
  return (
    // استفاده از motion.div برای افزودن انیمیشن به کل باکس
    <motion.div
      className="bg-[var(--component-bg)] shadow-2xl rounded-2xl p-6 border border-[#23272f] mx-2 md:mx-0 mt-8"
      initial={{ opacity: 0, y: 20 }} // حالت اولیه انیمیشن
      animate={{ opacity: 1, y: 0 }} // حالت نهایی انیمیشن
      transition={{ delay: 0.2, duration: 0.5 }} // تنظیمات زمان‌بندی انیمیشن
    >
      {/* عنوان اصلی کامپوننت */}
      <h2 className="text-base md:text-2xl font-medium mb-4 text-[var(--text-secondary)] text-center md:text-right">
        مقایسه درآمد و سود سال جاری با سال‌های قبل
      </h2>
      {/* بخش نمودارها */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* نمودار دایره‌ای درآمد */}
        <div className="w-full md:w-1/2">
          <h3 className="text-center text-lg font-semibold text-indigo-400 mb-2">
            درآمد سالانه
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={revenueData} // داده‌های درآمد
                dataKey="value" // کلید مقدار
                nameKey="name" // کلید نام (سال)
                cx="50%" // مرکز افقی نمودار
                cy="58%" // مرکز عمودی نمودار
                innerRadius={60} // شعاع داخلی (برای دونات)
                outerRadius={90} // شعاع خارجی
                fill="#6366f1" // رنگ پیش‌فرض
                label={renderCustomLabel} // لیبل سفارشی
                labelLine={true} // نمایش خط لیبل
              >
                {/* رنگ‌دهی به هر بخش نمودار */}
                {revenueData.map((entry, idx) => (
                  <Cell
                    key={`cell-revenue-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              {/* نمایش Tooltip هنگام هاور */}
              <Tooltip
                formatter={(value: number, name: string, props) => [
                  value.toLocaleString(),
                  `سال ${props && props.payload ? props.payload.name : name}`,
                ]}
                contentStyle={{
                  fontSize: "16px",
                  backgroundColor: "#23272f",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* نمودار دایره‌ای سود */}
        <div className="w-full md:w-1/2">
          <h3 className="text-center text-lg font-semibold text-green-400 mb-2">
            سود سالانه
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={profitData} // داده‌های سود
                dataKey="value" // کلید مقدار
                nameKey="name" // کلید نام (سال)
                cx="50%" // مرکز افقی نمودار
                cy="55%" // مرکز عمودی نمودار
                innerRadius={60} // شعاع داخلی (برای دونات)
                outerRadius={90} // شعاع خارجی
                fill="#22c55e" // رنگ پیش‌فرض
                label={renderCustomLabel} // لیبل سفارشی
                labelLine={true} // نمایش خط لیبل
                // حذف label برای جلوگیری از شلوغی و تداخل اعداد
              >
                {/* رنگ‌دهی به هر بخش نمودار */}
                {profitData.map((entry, idx) => (
                  <Cell
                    key={`cell-profit-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              {/* نمایش Tooltip هنگام هاور */}
              <Tooltip
                formatter={(value: number, name: string, props) => [
                  value.toLocaleString(),
                  `سال ${props && props.payload ? props.payload.name : name}`,
                ]}
                contentStyle={{
                  fontSize: "16px",
                  backgroundColor: "#23272f",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* نمایش درصد رشد درآمد و سود نسبت به سال قبل */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mt-8">
        <div className="bg-[#23272f] rounded-xl px-6 py-4 text-center text-gray-200 text-lg font-semibold shadow">
          رشد درآمد نسبت به سال قبل:{" "}
          <span className="text-indigo-400">{revenueGrowth}%</span>
        </div>
        <div className="bg-[#23272f] rounded-xl px-6 py-4 text-center text-gray-200 text-lg font-semibold shadow">
          رشد سود نسبت به سال قبل:{" "}
          <span className="text-green-400">{profitGrowth}%</span>
        </div>
      </div>
    </motion.div>
  );
};

// خروجی گرفتن کامپوننت برای استفاده در سایر بخش‌ها
export default YearlySalesDonutChart;
