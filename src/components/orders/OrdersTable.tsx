// این کامپوننت لیست سفارشات را نمایش می‌دهد و امکانات جستجو، فیلتر، و ویرایش سفارشات را فراهم می‌کند
"use client"; // این خط مشخص می‌کند که کامپوننت در سمت کلاینت اجرا می‌شود

import React, { useEffect, useMemo, useState } from "react"; // ایمپورت ری‌اکت و هوک‌های مورد نیاز
import { useSearchParams, useRouter, usePathname } from "next/navigation"; // هوک‌های مربوط به مدیریت پارامترهای جستجو و مسیر در Next.js
import { motion } from "framer-motion"; // برای انیمیشن دادن به اجزای کامپوننت
import { Order } from "../../../public/data/dataTypes"; // تایپ سفارش برای تایپ‌اسکریپت
import OrderSearchInput from "./OrderSearchInput"; // کامپوننت ورودی جستجو
import OrderStatusFilter from "./OrderStatusFilter"; // کامپوننت فیلتر وضعیت سفارش
import OrderCountryFilter from "./OrderCountryFilter"; // کامپوننت فیلتر کشور سفارش
import Pagination from "../Pagination"; // کامپوننت صفحه‌بندی
import OrderTableRow from "./OrderTableRow"; // کامپوننت ردیف جدول سفارش

const ITEMS_PER_PAGE = 4; // تعداد آیتم‌هایی که در هر صفحه نمایش داده می‌شود

const OrdersTable = () => {
  // تعریف state برای نگهداری لیست سفارشات
  const [orders, setOrders] = useState<Order[]>([]);
  // state برای نگهداری id ردیفی که در حال ویرایش است
  const [editingRow, setEditingRow] = useState<string | null>(null);

  // گرفتن پارامترهای جستجو از URL
  const searchParams = useSearchParams();
  const router = useRouter(); // برای تغییر مسیر و پارامترها
  const pathname = usePathname(); // گرفتن مسیر فعلی

  // state برای نگهداری مقدار جستجو، وضعیت و کشور از پارامترهای URL یا مقدار پیش‌فرض
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [status, setStatus] = useState<string>(
    searchParams.get("status") || ""
  );
  const [country, setCountry] = useState<string>(
    searchParams.get("country") || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(1); // صفحه فعلی

  // گرفتن داده‌های سفارشات از فایل json هنگام بارگذاری کامپوننت
  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders));
  }, []);

  // تابع برای به‌روزرسانی پارامتر جستجو در URL
  const updateSearchParam = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // تابع برای به‌روزرسانی پارامتر وضعیت در URL
  const updateStatusParam = (stat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (stat) {
      params.set("status", stat);
    } else {
      params.delete("status");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // تابع برای به‌روزرسانی پارامتر کشور در URL
  const updateCountryParam = (cnt: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cnt) {
      params.set("country", cnt);
    } else {
      params.delete("country");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // وقتی روی دکمه ویرایش کلیک می‌شود، id ردیف را در state ذخیره می‌کند
  const handleEditClick = (id: string): void => {
    setEditingRow(id);
  };

  // وقتی روی دکمه ذخیره کلیک می‌شود، حالت ویرایش را غیرفعال می‌کند
  const handleSaveClick = (): void => {
    setEditingRow(null);
  };

  // تابع برای تغییر مقدار یک فیلد خاص از یک سفارش خاص
  const handleChange = (
    id: string,
    field: keyof Order,
    value: string
  ): void => {
    // اگر فیلد total باشد، فقط اعداد معتبر را قبول می‌کند
    if (field === "total" && !/^\d*\.?\d*$/.test(value)) return;

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              [field]: field === "total" ? Number(value) : value,
            }
          : order
      )
    );
  };

  // حذف یک سفارش بر اساس id
  const handleDeleteOrder = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  // فیلتر کردن سفارشات بر اساس جستجو، وضعیت و کشور
  const filteredOrders = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const trimmedStatus = status.trim();
    const trimmedCountry = country.trim();

    return orders.filter((order) => {
      // بررسی اینکه نام کاربر شامل عبارت جستجو باشد
      const matchesSearch =
        !trimmedSearch || order.client?.toLowerCase().includes(trimmedSearch);

      // بررسی وضعیت سفارش
      const matchesStatus = !trimmedStatus || order.status === trimmedStatus;
      // بررسی کشور سفارش
      const matchesCountry =
        !trimmedCountry || order.country === trimmedCountry;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [orders, searchTerm, status, country]);

  // محاسبه تعداد کل صفحات بر اساس تعداد سفارشات فیلتر شده
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  // گرفتن سفارشات مربوط به صفحه فعلی
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage]);

  // تغییر صفحه فعلی هنگام کلیک روی صفحه‌بندی
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // رندر کامپوننت
  return (
    <motion.div
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }} // مقدار اولیه انیمیشن
      animate={{ opacity: 1, y: 0 }} // مقدار نهایی انیمیشن
      transition={{ delay: 0.2, duration: 0.5 }} // تنظیمات زمان‌بندی انیمیشن
    >
      {/* هدر جدول */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--text-secondary)] text-center md:text-right">
          لیست سفارشات
        </h2>
      </div>

      {/* فیلترها و جستجو */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <OrderSearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val); // مقدار جستجو را تغییر می‌دهد
            updateSearchParam(val); // پارامتر جستجو را در URL به‌روزرسانی می‌کند
            setCurrentPage(1); // به صفحه اول برمی‌گردد
          }}
        />
        <OrderStatusFilter
          value={status}
          onChange={(val) => {
            setStatus(val); // مقدار وضعیت را تغییر می‌دهد
            updateStatusParam(val); // پارامتر وضعیت را در URL به‌روزرسانی می‌کند
            setCurrentPage(1); // به صفحه اول برمی‌گردد
          }}
        />
        <OrderCountryFilter
          value={country}
          onChange={(val) => {
            setCountry(val); // مقدار کشور را تغییر می‌دهد
            updateCountryParam(val); // پارامتر کشور را در URL به‌روزرسانی می‌کند
            setCurrentPage(1); // به صفحه اول برمی‌گردد
          }}
        />
      </div>

      {/* جدول سفارشات */}
      <div className=" mt-4 overflow-clip">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                شناسه سفارش
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                کاربر
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                جمع
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                وضعیت
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                کشور
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {/* رندر هر ردیف سفارش */}
            {paginatedOrders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                editingRow={editingRow}
                handleEditClick={handleEditClick}
                handleSaveClick={handleSaveClick}
                handleChange={handleChange}
                handleDeleteOrder={handleDeleteOrder}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* کامپوننت صفحه‌بندی */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
};

export default OrdersTable; // خروجی گرفتن کامپوننت برای استفاده در سایر بخش‌ها
