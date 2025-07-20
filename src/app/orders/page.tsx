// این فایل یک کامپوننت صفحه سفارشات (OrdersPage) را تعریف می‌کند که اطلاعات آماری سفارشات و جدول سفارشات را نمایش می‌دهد
"use client"; // این خط مشخص می‌کند که این کامپوننت باید در سمت کلاینت اجرا شود

import { motion } from "framer-motion"; // ایمپورت کتابخانه framer-motion برای انیمیشن‌ها
import { Ban, CheckCircle, Clock, ShoppingBag } from "lucide-react"; // ایمپورت آیکون‌ها از کتابخانه lucide-react
import { useState, useEffect } from "react"; // ایمپورت هوک‌های useState و useEffect از ری‌اکت
import { OrderStat } from "../../../public/data/dataTypes"; // ایمپورت تایپ OrderStat برای تایپ‌اسکریپت
import StatCard from "../../components/StateCard"; // ایمپورت کامپوننت کارت آماری
import OrdersTable from "../../components/orders/OrdersTable"; // ایمپورت جدول سفارشات

// یک آبجکت برای نگهداری آیکون‌ها بر اساس نام آن‌ها
const iconMap = {
  ShoppingBag, // آیکون سبد خرید
  CheckCircle, // آیکون تیک
  Clock,       // آیکون ساعت
  Ban,         // آیکون لغو
};

function OrdersPage() {
  // تعریف state برای نگهداری آمار سفارشات
  const [orderStats, setOrderStats] = useState<OrderStat[]>([]);

  // استفاده از useEffect برای دریافت داده‌ها هنگام بارگذاری کامپوننت
  useEffect(() => {
    // دریافت داده‌ها از فایل data.json
    fetch("/data/data.json")
      .then((response) => response.json()) // تبدیل پاسخ به json
      .then((data) => setOrderStats(data.orderStats)); // ذخیره آمار سفارشات در state
  }, []); // این آرایه خالی باعث می‌شود این کد فقط یک بار اجرا شود

  return (
    // کانتینر اصلی صفحه با کلاس‌های استایل‌دهی
    <div className="flex-1 relative overflow-auto z-10">
      <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* بخش کارت‌های آماری با انیمیشن framer-motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // مقدار اولیه انیمیشن
          animate={{ opacity: 1, y: 0 }}   // مقدار نهایی انیمیشن
          transition={{ duration: 1 }}      // مدت زمان انیمیشن
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {/* نمایش هر کارت آماری با استفاده از map روی orderStats */}
          {orderStats.map(({ name, value, icon }) => {
            const IconComponent = iconMap[icon as keyof typeof iconMap]; // انتخاب آیکون مناسب بر اساس نام
            return (
              <StatCard
                key={name} // کلید یکتا برای هر کارت
                name={name || ""} // نام آمار
                icon={IconComponent} // آیکون مربوطه
                value={value || ""} // مقدار آمار
              />
            );
          })}
        </motion.div>
        {/* نمایش جدول سفارشات */}
        <OrdersTable />
      </div>
    </div>
  );
}

export default OrdersPage; // خروجی گرفتن کامپوننت OrdersPage
