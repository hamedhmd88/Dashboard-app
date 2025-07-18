"use client";
import React, { useEffect, useState } from "react";
import { OrderStatus } from "../../public/data/dataTypes";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";


const COLORS = ["#F8C02D", "#03A9F4", "#EF4444", "#8BC34A"]; // Pending, Processing, Canceled, Delivered

const OrderChart = () => {
  const [orderStatusData, setOrderStatusData] = useState<OrderStatus[]>([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setOrderStatusData(data.orderStatus));
  }, []);

  // تابع سفارشی برای رندر کردن لیبل‌ها
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
    fill,
  }: any) => {
    // === تعریف sin و cos در اینجا ===
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    // ===============================

    const radius = outerRadius + 30; // این فاصله رو زیادتر کردیم (30 پیکسل از outerRadius)
    // این x و y مستقیماً در حال حاضر استفاده نمی‌شوند ولی برای فهم بهتر منطق محاسبه قرار داده شده‌اند.
    // const x = cx + radius * cos;
    // const y = cy + radius * sin;

    // مختصات نهایی برای پایان خط راهنما و شروع متن
    // نقطه شروع خط راهنما روی outerRadius + 5 پیکسل (برای فاصله کم از دایره)
    const x1 = cx + (outerRadius + 5) * cos;
    const y1 = cy + (outerRadius + 5) * sin;

    // نقطه پایان خط راهنما (که لیبل از آن فاصله می‌گیرد)
    const x2 = cx + (outerRadius + 25) * cos; // این هم کمی بیشتر شد
    const y2 = cy + (outerRadius + 25) * sin;

    // مختصات نهایی متن (فاصله بیشتر از خط راهنما)
    const textFinalX = cx + (outerRadius + 40) * cos; // فاصله متن از مرکز دایره
    const textFinalY = cy + (outerRadius + 40) * sin; // فاصله متن از مرکز دایره

    // تصمیم‌گیری برای textAnchor (مهم برای RTL)
    // اگر لیبل در سمت راست محور عمودی باشد (cos > 0)، متن از نقطه خود به سمت چپ (پایان متن) می‌رود
    // اگر لیبل در سمت چپ محور عمودی باشد (cos < 0)، متن از نقطه خود به سمت راست (شروع متن) می‌رود
    const anchor = cos >= 0 ? "end" : "start"; // <--- تغییر منطق textAnchor برای RTL و چسبندگی به خطوط

    return (
      <g>
        {/* خط راهنما */}
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
            fontSize: "15px", // فونت را بزرگتر کردیم (مثلاً 15px)
          }}
        >
          {`${name} %${Math.round(percent * 100)}`} {/* درصد را به فرمت فارسی (قبل از عدد) تغییر دادیم */}
        </text>
      </g>
    );
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.6 }}
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 text-right"
    >
      <h2 className="text-base md:text-xl font-semibold text-[var(--text-secondary)] mb-4 text-center md:text-right">
        وضعیت سفارش محصولات
      </h2>
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              outerRadius={90} // شعاع بیرونی نمودار
              dataKey="value"
              label={renderCustomizedLabel} // استفاده از تابع سفارشی لیبل
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4b5563",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "12px",
                direction: "rtl",
                textAlign: "right",
              }}
              itemStyle={{
                color: "#e5e7eb",
                direction: "rtl",
                fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
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
                <span style={{ marginRight: 8, direction: "rtl" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrderChart;

