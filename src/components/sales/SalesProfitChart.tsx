// این کامپوننت یک نمودار میله‌ای برای نمایش سود و ضرر فروش‌ها بر اساس تاریخ نمایش می‌دهد
import React from "react";
// ایمپورت کامپوننت‌ها و ابزارهای مورد نیاز از کتابخانه recharts برای رسم نمودار
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
// ایمپورت motion از framer-motion برای انیمیشن دادن به کامپوننت
import { motion } from "framer-motion";
// ایمپورت نوع داده SaleRecord برای تایپ‌چکینگ
import { SaleRecord } from "../../../public/data/dataTypes";

// تعریف نوع پراپس‌های ورودی کامپوننت
// salesRecords: آرایه‌ای از رکوردهای فروش
type Props = {
  salesRecords: SaleRecord[];
};

// تعریف کامپوننت SalesProfitChart به صورت تابعی و دریافت پراپس salesRecords
const SalesProfitChart: React.FC<Props> = ({ salesRecords }) => {
  // گروه‌بندی رکوردها بر اساس تاریخ و جمع کردن سود و ضرر هر روز
  // chartData آرایه‌ای از آبجکت‌هاست که هر کدام شامل تاریخ، مجموع سود و مجموع ضرر آن روز است
  const chartData = Object.values(
    salesRecords.reduce((acc, rec) => {
      // اگر برای این تاریخ قبلاً آبجکتی ساخته نشده، یک آبجکت جدید با مقدار اولیه سود و ضرر صفر می‌سازیم
      if (!acc[rec.date]) {
        acc[rec.date] = { date: rec.date, profit: 0, loss: 0 };
      }
      // اگر مقدار profit مثبت یا صفر باشد، به مجموع سود اضافه می‌شود
      if (rec.profit >= 0) {
        acc[rec.date].profit += rec.profit;
      } else {
        // اگر مقدار profit منفی باشد، قدر مطلق آن به مجموع ضرر اضافه می‌شود
        acc[rec.date].loss += Math.abs(rec.profit);
      }
      return acc;
    }, {} as Record<string, { date: string; profit: number; loss: number }>)
  );

  // رندر کردن کامپوننت با انیمیشن ظاهر شدن
  return (
    <motion.div
      className="bg-[var(--component-bg)] shadow-2xl rounded-2xl p-6 border border-[var(--border)] mx-2 md:mx-0"
      initial={{ opacity: 0, y: 20 }} // مقدار اولیه انیمیشن (محو و کمی پایین)
      animate={{ opacity: 1, y: 0 }} // مقدار نهایی انیمیشن (نمایش کامل و جای اصلی)
      transition={{ delay: 0.2, duration: 0.5 }} // مدت و تاخیر انیمیشن
    >
      {/* عنوان نمودار */}
      <h2 className="text-base md:text-2xl font-medium mb-4 text-[var(--text-secondary)] text-center md:text-right">
        نمودار سود و ضرر فروش
      </h2>
      {/* ظرف نمودار با ارتفاع مشخص */}
      <div className="h-72 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          {/* نمودار میله‌ای با داده‌های آماده شده */}
          <BarChart data={chartData}>
            {/* شبکه‌بندی پس‌زمینه نمودار */}
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            {/* محور افقی (تاریخ) */}
            <XAxis
              dataKey="date"
              stroke="var(--text-secondary)"
              tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
            />
            {/* محور عمودی (مقادیر سود/ضرر) */}
            <YAxis
              stroke="var(--text-secondary)"
              tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
              width={60}
            />
            {/* نمایش اطلاعات هر ستون هنگام هاور کردن */}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--component-bg)",
                borderColor: "var(--border)",
                fontSize: "12px",
                opacity: 0.8,
              }}
              itemStyle={{ color: "var(--foreground)" }}
              formatter={(value: number, name: string, props) => {
                // تعیین عنوان مناسب برای هر مقدار (سود یا ضرر) در تولتیپ
                if (props && props.dataKey) {
                  if (props.dataKey === "profit")
                    return [value.toLocaleString(), "سود"];
                  if (props.dataKey === "loss")
                    return [value.toLocaleString(), "ضرر"];
                }
                if (name === "profit" || name === "سود")
                  return [value.toLocaleString(), "سود"];
                if (name === "loss" || name === "ضرر")
                  return [value.toLocaleString(), "ضرر"];
                return [value.toLocaleString(), name];
              }}
            />
            {/* نمایش راهنمای رنگ‌ها و عناوین نمودار */}
            <Legend
              content={({ payload }) => (
                <ul className="flex flex-row-reverse gap-6 justify-center mt-4">
                  {payload &&
                    payload.map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-center">
                        <span className="text-base text-[var(--foreground)] font-semibold">
                          {entry.dataKey === "profit"
                            ? "سود"
                            : entry.dataKey === "loss"
                            ? "ضرر"
                            : entry.value}
                        </span>
                        <span
                          className="mr-2 inline-block w-4 h-4 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                      </li>
                    ))}
                </ul>
              )}
            />
            {/* ستون‌های سود با رنگ سبز */}
            <Bar
              dataKey="profit"
              fill="#22c55e"
              name="سود"
              radius={[8, 8, 0, 0]}
            />
            {/* ستون‌های ضرر با رنگ قرمز */}
            <Bar
              dataKey="loss"
              fill="#ef4444"
              name="ضرر"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// خروجی گرفتن کامپوننت برای استفاده در سایر بخش‌ها
export default SalesProfitChart;
