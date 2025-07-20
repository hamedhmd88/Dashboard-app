// این فایل یک کامپوننت صفحه فروش است که اطلاعات فروش را نمایش می‌دهد
"use client"; // فعال‌سازی حالت کلاینت برای این صفحه در Next.js

// ایمپورت هوک‌ها و کتابخانه‌های مورد نیاز
import { useEffect, useState } from "react"; // برای مدیریت state و انجام عملیات پس از رندر
import { motion } from "framer-motion"; // برای انیمیشن دادن به عناصر
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"; // آیکون‌های مورد استفاده در کارت‌ها
import StateCard from "@/components/StateCard"; // کامپوننت کارت وضعیت برای نمایش آمار
import SalesProfitChart from "@/components/sales/SalesProfitChart"; // نمودار سود فروش
import YearlySalesDonutChart from "@/components/sales/YearlySalesDonutChart"; // نمودار دونات فروش سالانه
import { SaleRecord } from "../../../public/data/dataTypes"; // نوع داده رکورد فروش

function SalesPage() {
  // تعریف state برای نگهداری لیست رکوردهای فروش
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>([]);

  // استفاده از useEffect برای دریافت داده‌های فروش از فایل json پس از اولین رندر
  useEffect(() => {
    fetch("/data/data.json") // درخواست گرفتن داده از فایل json
      .then((res) => res.json()) // تبدیل پاسخ به json
      .then((data) => setSalesRecords(data.salesRecords || [])); // ذخیره رکوردها در state
  }, []); // فقط یک بار پس از رندر اجرا می‌شود

  // محاسبه تعداد کل فروش‌ها
  const totalSales = salesRecords.length;
  // محاسبه مجموع درآمد فقط برای فروش‌های موفق
  const totalRevenue = salesRecords.filter(s => s.status === "موفق").reduce((sum, s) => sum + s.amount, 0);
  // محاسبه مجموع سود کل
  const totalProfit = salesRecords.reduce((sum, s) => sum + s.profit, 0);
  // محاسبه مجموع ضرر از فروش‌های لغو شده
  const totalLoss = salesRecords.filter(s => s.status === "لغو شده").reduce((sum, s) => sum + Math.abs(s.profit), 0);

  // رندر کردن صفحه
  return (
    <div className="flex-1 overflow-auto relative z-10"> {/* کانتینر اصلی صفحه */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8"> {/* بخش اصلی با فاصله‌گذاری مناسب */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8" // گرید برای نمایش کارت‌ها
          initial={{ opacity: 0, y: 20 }} // مقدار اولیه انیمیشن
          animate={{ opacity: 1, y: 0 }} // مقدار نهایی انیمیشن
          transition={{ duration: 1 }} // مدت زمان انیمیشن
        >
          {/* کارت‌های آماری */}
          <StateCard name="تعداد فروش‌ها" icon={TrendingUp} value={totalSales.toLocaleString()} /> {/* نمایش تعداد فروش‌ها */}
          <StateCard name="درآمد کل" icon={DollarSign} value={totalRevenue.toLocaleString()} /> {/* نمایش درآمد کل */}
          <StateCard name="سود کل" icon={ArrowUpRight} value={totalProfit.toLocaleString()} /> {/* نمایش سود کل */}
          <StateCard name="ضرر از لغوها" icon={ArrowDownRight} value={totalLoss.toLocaleString()} /> {/* نمایش ضرر از لغو شده‌ها */}
        </motion.div>
        {/* نمودار سود فروش */}
        <SalesProfitChart salesRecords={salesRecords} />
        {/* نمودار دونات فروش سالانه */}
        <YearlySalesDonutChart />
      </main>
    </div>
  );
}

export default SalesPage; // خروجی گرفتن کامپوننت صفحه فروش 