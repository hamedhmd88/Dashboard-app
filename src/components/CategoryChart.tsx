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
import { Category } from "../../public/data/dataTypes"; // مسیر را چک کنید
import { motion } from "framer-motion";

// COLORS: مطمئن شوید که تعداد رنگ‌ها با تعداد دسته‌بندی‌های شما (گوشی هوشمند، لپتاپ، مبلمان، زیبایی، لوازم جانبی بازی) مطابقت دارد.
// اگر 5 دسته دارید، 5 رنگ باید باشد.
// با توجه به عکس، 5 رنگ دارید: قرمز، آبی، نارنجی، سبزآبی، بنفش کم‌رنگ
const COLORS = ["#FF6B6B", "#4D96FF", "#FFD166", "#06D6A0", "#A29BFE"];
//  گوشی هوشمند (قرمز)، لپتاپ (آبی)، مبلمان (نارنجی)، زیبایی و مراقبت شخصی (سبزآبی)، لوازم جانبی بازی (بنفش)

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

  const outerRadius = isSmallMediaScreen ? 60 : 90;

  // تابع سفارشی برای رندر کردن لیبل‌ها (دقیقاً مشابه OrderChart)
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
    fill, // دریافت رنگ قطعه
  }: any) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);

    // مختصات نهایی برای پایان خط راهنما و شروع متن
    // نقطه شروع خط راهنما روی outerRadius + 5 پیکسل (برای فاصله کم از دایره)
    const x1 = cx + (outerRadius + 5) * cos;
    const y1 = cy + (outerRadius + 5) * sin;

    // نقطه پایان خط راهنما (که لیبل از آن فاصله می‌گیرد)
    const x2 = cx + (outerRadius + 25) * cos; // 25 پیکسل فاصله از outerRadius برای نقطه پایانی خط
    const y2 = cy + (outerRadius + 25) * sin;

    // مختصات نهایی متن (فاصله بیشتر از خط راهنما)
    const textFinalX = cx + (outerRadius + 40) * cos; // 40 پیکسل فاصله متن از مرکز دایره
    const textFinalY = cy + (outerRadius + 40) * sin; // 40 پیکسل فاصله متن از مرکز دایره

    // تصمیم‌گیری برای textAnchor (مهم برای RTL)
    // اگر لیبل در سمت راست محور عمودی باشد (cos > 0)، متن از نقطه خود به سمت چپ (پایان متن) می‌رود
    // اگر لیبل در سمت چپ محور عمودی باشد (cos < 0)، متن از نقطه خود به سمت راست (شروع متن) می‌رود
    const anchor = cos >= 0 ? "end" : "start";

    return (
      <g>
        {/* خط راهنما - رنگ آن با رنگ قطعه یکسان است */}
        <path d={`M${x1},${y1}L${x2},${y2}`} stroke={fill} fill="none" />
        {/* متن لیبل */}
        <text
          x={textFinalX}
          y={textFinalY}
          direction="rtl" // بسیار مهم برای RTL در SVG
          textAnchor={anchor} // تراز افقی متن
          dominantBaseline="middle" // تراز عمودی متن
          fill={fill} // رنگ متن برابر با رنگ قطعه
          style={{
            fontSize: "15px", // <--- فونت را بزرگتر کردیم (مثلاً 15px)
          }}
        >
          {`${name} %${Math.round(percent * 100)}`}{" "}
          {/* <--- درصد را به فرمت فارسی (قبل از عدد) تغییر دادیم */}
        </text>
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      // اضافه کردن dir="rtl" و text-right برای پشتیبانی کامل RTL
      className="bg-[#0A0A0A] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 text-right"
    >
      <h2 className="text-base md:text-lg font-medium mb-4 text-gray-300 text-center md:text-right">
        دسته بندی محصولات{" "}
      </h2>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false} // این خط را دیگر لازم نداریم چون در تابع renderCustomizedLabel رسم می‌شود
              outerRadius={outerRadius}
              dataKey="value"
              label={renderCustomizedLabel} // استفاده از تابع سفارشی renderCustomizedLabel
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
                fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif", // اطمینان از فونت فارسی
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
                marginTop: "20px",
              }}
              formatter={(value) => (
                <span style={{ marginRight: 8, direction: "rtl" }}>
                  {value}
                </span> // اطمینان از جهت‌دهی RTL در لجند
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryChart;
