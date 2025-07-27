"use client"; // این دستور نشان می‌دهد که کامپوننت سمت کلاینت اجرا می‌شود.

// ایمپورت کردن کتابخانه‌های مورد نیاز برای مدیریت حالت، افکت‌ها و انیمیشن.
import React, { useEffect, useState } from "react";
// ایمپورت کامپوننت‌های Recharts برای ساخت نمودار دایره‌ای.
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
// ایمپورت نوع Category از فایل dataTypes.
import { Category } from "../../public/data/dataTypes";
// ایمپورت motion از framer-motion برای انیمیشن‌ها.
import { motion } from "framer-motion";

// تعریف آرایه‌ای از رنگ‌ها برای بخش‌های مختلف نمودار دایره‌ای.
// هر رنگ به یک دسته‌بندی محصول اختصاص دارد (مثلاً قرمز برای گوشی هوشمند).
const COLORS = ["#FF6B6B", "#4D96FF", "#FFD166", "#06D6A0", "#A29BFE"];

// تعریف کامپوننت CategoryChart که نمودار دایره‌ای دسته‌بندی محصولات را نمایش می‌دهد.
const CategoryChart = () => {
  // حالت برای ذخیره داده‌های دسته‌بندی‌ها (از نوع آرایه Category).
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  // حالت برای تشخیص اینکه آیا صفحه کوچک (موبایل) است یا نه.
  const [isSmallMediaScreen, setIsSmallMediaScreen] = useState<boolean>(false);

  // افکت برای بارگذاری داده‌ها از فایل JSON هنگام mount شدن کامپوننت.
  useEffect(() => {
    // درخواست fetch برای دریافت داده‌ها.
    fetch("/data/data.json")
      .then((res) => res.json()) // تبدیل پاسخ به JSON.
      .then((data) => {
        setTimeout(() => setCategoryData(data.categories), 2000);
      });
  }, []); // وابستگی خالی برای اجرای تنها یک بار.

  // افکت برای بررسی و به‌روزرسانی اندازه صفحه نمایش.
  useEffect(() => {
    // تابع برای چک کردن عرض صفحه.
    const updateScreenSize = () => {
      setIsSmallMediaScreen(window.innerWidth <= 768); // اگر عرض کمتر از 768 باشد، موبایل در نظر گرفته می‌شود.
    };
    updateScreenSize(); // اجرای اولیه.
    window.addEventListener("resize", updateScreenSize); // اضافه کردن listener برای تغییرات اندازه.
    return () => {
      window.removeEventListener("resize", updateScreenSize); // پاکسازی listener هنگام unmount.
    };
  }, []); // وابستگی خالی برای اجرای تنها یک بار.

  // محاسبه شعاع خارجی نمودار بر اساس اندازه صفحه (کوچک‌تر برای موبایل).
  const outerRadius = isSmallMediaScreen ? 60 : 90;

  // تابع سفارشی برای رندر برچسب‌های سفارشی روی نمودار (شامل نام، درصد و خط راهنما).
  const renderCustomizedLabel = ({
    cx, // مختصات x مرکز دایره.
    cy, // مختصات y مرکز دایره.
    midAngle, // زاویه میانی بخش.
    outerRadius, // شعاع خارجی.
    percent, // درصد بخش.
    name, // نام دسته‌بندی.
    fill, // رنگ بخش.
  }: any) => {
    const RADIAN = Math.PI / 180; // تبدیل درجه به رادیان.
    const sin = Math.sin(-midAngle * RADIAN); // محاسبه سینوس زاویه (منفی برای جهت ساعتگرد).
    const cos = Math.cos(-midAngle * RADIAN); // محاسبه کسینوس زاویه.

    // محاسبه موقعیت‌های خط راهنما و متن برچسب.
    const x1 = cx + (outerRadius + 5) * cos; // نقطه شروع خط.
    const y1 = cy + (outerRadius + 5) * sin;
    const x2 = cx + (outerRadius + 25) * cos; // نقطه پایان خط.
    const y2 = cy + (outerRadius + 25) * sin;
    const textFinalX = cx + (outerRadius + 40) * cos; // موقعیت متن.
    const textFinalY = cy + (outerRadius + 40) * sin;

    // تعیین انکور متن برای پشتیبانی از متن راست به چپ (RTL).
    const anchor = cos >= 0 ? "end" : "start";

    return (
      <g>
        {" "}
        {/* گروه SVG برای خط و متن. */}
        {/* رسم خط راهنما از بخش نمودار به متن. */}
        <path d={`M${x1},${y1}L${x2},${y2}`} stroke={fill} fill="none" />
        {/* نمایش متن برچسب شامل نام و درصد گرد شده. */}
        <text
          x={textFinalX}
          y={textFinalY}
          direction="rtl" // جهت راست به چپ برای متن فارسی.
          textAnchor={anchor} // انکور متن بر اساس موقعیت.
          dominantBaseline="middle" // تراز عمودی متن.
          fill={fill} // رنگ متن همان رنگ بخش.
          style={{
            fontSize: "15px", // اندازه فونت.
          }}
        >
          {`${name} %${Math.round(percent * 100)}`}{" "}
          {/* محتوای برچسب: نام % درصد. */}
        </text>
      </g>
    );
  };

  return (
    // کانتینر اصلی کامپوننت با انیمیشن ورودی از پایین به بالا با استفاده از framer-motion.
    <motion.div
      initial={{ opacity: 0, y: 20 }} // حالت اولیه: نامرئی و پایین‌تر.
      animate={{ opacity: 1, y: 0 }} // حالت نهایی: مرئی و در موقعیت اصلی.
      transition={{ delay: 0.2, duration: 0.5 }} // تأخیر 0.2 ثانیه و مدت 0.5 ثانیه برای انیمیشن.
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 text-right" // کلاس‌های Tailwind برای استایل: پس‌زمینه، بلور، سایه، گردی، پدینگ responsive، مرز و تراز متن راست.
    >
      {/* عنوان نمودار با استایل responsive برای اندازه و تراز. */}
      <h2 className="text-base md:text-2xl font-medium mb-4 text-[var(--text-secondary)] text-center md:text-right">
دسته بندی محصولات      </h2>
      {/* div کانتینر برای نمودار با ارتفاع responsive (64 برای موبایل، 80 برای دسکتاپ). */}
      <div className="h-64 md:h-80">
        {/* کامپوننت ResponsiveContainer از Recharts برای تنظیم اندازه نمودار بر اساس کانتینر والد. */}
        <ResponsiveContainer width="100%" height="100%">
          {/* کامپوننت اصلی PieChart برای رندر نمودار دایره‌ای. */}
          <PieChart>
            {/* تنظیمات بخش Pie: داده‌ها، موقعیت مرکز، بدون خط برچسب، شعاع خارجی، کلید داده (value)، و تابع برچسب سفارشی. */}
            <Pie
              data={categoryData} // داده‌های دسته‌بندی‌ها.
              cx="50%" // موقعیت x مرکز (50% عرض).
              cy="50%" // موقعیت y مرکز (50% ارتفاع).
              labelLine={false} // غیرفعال کردن خطوط برچسب پیش‌فرض.
              outerRadius={outerRadius} // شعاع خارجی محاسبه‌شده.
              dataKey="value" // کلید داده برای مقادیر بخش‌ها.
              label={renderCustomizedLabel} // استفاده از تابع سفارشی برای برچسب‌ها.
            >
              {/* حلقه برای رندر هر Cell (بخش) با رنگ مربوطه از آرایه COLORS. */}
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`} // کلید منحصر به فرد برای هر بخش.
                  fill={COLORS[index % COLORS.length]} // انتخاب رنگ چرخشی از آرایه.
                />
              ))}
            </Pie>
            {/* تنظیمات Tooltip برای نمایش اطلاعات هنگام hover، با استایل سفارشی برای RTL و رنگ‌ها. */}
            <Tooltip
              contentStyle={{
                // استایل محتوای تولتیپ.
                backgroundColor: "rgba(31, 41, 55, 0.8)", // پس‌زمینه نیمه‌شفاف تیره.
                borderBlock: "#4b5563", // مرز بلوک.
                borderRadius: "8px", // گردی مرز.
                padding: "8px", // پدینگ داخلی.
                fontSize: "14px", // اندازه فونت.
                direction: "rtl", // جهت راست به چپ.
                textAlign: "right", // تراز متن راست.
              }}
              itemStyle={{
                // استایل آیتم‌های داخل تولتیپ.
                color: "#e5e7eb", // رنگ متن.
                direction: "rtl", // جهت RTL.
                fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif", // فونت‌های پشتیبانی‌شده.
              }}
            />
            {/* تنظیمات Legend (راهنما) برای نمایش نام دسته‌ها با آیکون دایره‌ای. */}
            <Legend
              iconType="circle" // نوع آیکون: دایره.
              layout="horizontal" // چیدمان افقی.
              align="center" // تراز مرکزی.
              wrapperStyle={{
                // استایل wrapper.
                fontSize: 14, // اندازه فونت.
                direction: "rtl", // RTL.
                textAlign: "right", // تراز راست.
                display: "flex", // نمایش flex.
                justifyContent: "center", // مرکزی کردن.
                marginTop: "20px", // حاشیه بالا.
              }}
              formatter={(
                value // فرمت‌کننده برای نمایش نام با حاشیه راست.
              ) => (
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

// اکسپورت کامپوننت برای استفاده در سایر فایل‌ها.
export default CategoryChart;
