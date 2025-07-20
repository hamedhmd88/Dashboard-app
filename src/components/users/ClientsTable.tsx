/**
 * این کامپوننت جدول مشتریان را مدیریت و نمایش می‌دهد.
 * داده‌ها را از data.json واکشی می‌کند.
 * جستجو، فیلتر کشور، صفحه‌بندی و عملیات CRUD را پشتیبانی می‌کند.
 */
"use client"; // فعال‌سازی حالت کلاینت برای این کامپوننت در Next.js

// ایمپورت ری‌اکت و هوک‌های مورد نیاز
import React, { useEffect, useMemo, useState } from "react";
// ایمپورت انیمیشن برای افکت‌های حرکتی
import { motion } from "framer-motion";
// ایمپورت هوک‌های مربوط به مدیریت پارامترهای جستجو و مسیر در Next.js
import { useSearchParams, useRouter, usePathname } from "next/navigation";
// ایمپورت تایپ Client برای تایپ‌چکینگ داده‌های مشتریان
import { Client } from "../../../public/data/dataTypes";
// ایمپورت کامپوننت ورودی جستجو
import ClientSearchInput from "./ClientSearchInput";
// ایمپورت کامپوننت صفحه‌بندی
import Pagination from "../Pagination";
// ایمپورت ردیف جدول مشتریان
import ClientTableRow from "./ClientTableRow";
// ایمپورت فیلتر کشور
import ClientCountryFilter from "./ClientCountryFilter";

const ITEMS_PER_PAGE = 4; // تعداد آیتم‌ها در هر صفحه

/**
 * کامپوننت اصلی جدول مشتریان که داده‌ها را مدیریت و نمایش می‌دهد.
 */
const ClientsTable = () => {
  // تعریف state برای لیست مشتریان
  const [clients, setClients] = useState<Client[]>([]); // آرایه مشتریان
  // تعریف state برای ردیف در حال ویرایش (id مشتری)
  const [editingRow, setEditingRow] = useState<number | null>(null);
  // تعریف state برای عبارت جستجو
  const [searchTerm, setSearchTerm] = useState<string>("");
  // تعریف state برای شماره صفحه فعلی
  const [currentPage, setCurrentPage] = useState<number>(1);
  // تعریف state برای کشور انتخاب شده جهت فیلتر
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // گرفتن پارامترهای جستجو از URL
  const searchParams = useSearchParams();
  // گرفتن router برای تغییر مسیر
  const router = useRouter();
  // گرفتن مسیر فعلی
  const pathname = usePathname();

  // همگام‌سازی مقدار جستجو و کشور با پارامترهای URL هنگام تغییر آن‌ها
  useEffect(() => {
    const search = searchParams.get("search") || ""; // مقدار جستجو از URL
    const country = searchParams.get("country") || ""; // مقدار کشور از URL
    setSearchTerm(search); // ست کردن مقدار جستجو
    setSelectedCountry(country); // ست کردن مقدار کشور
  }, [searchParams]); // اجرا هنگام تغییر پارامترها

  // تابع برای به‌روزرسانی پارامتر جستجو در URL
  const updateSearchParam = (term: string) => {
    const params = new URLSearchParams(searchParams.toString()); // کپی پارامترها
    if (term) {
      params.set("search", term); // اگر مقدار وجود داشت، ست کن
    } else {
      params.delete("search"); // در غیر این صورت حذف کن
    }
    router.push(`${pathname}?${params.toString()}`); // تغییر مسیر با پارامتر جدید
  };

  // تابع برای به‌روزرسانی پارامتر کشور در URL
  const updateCountryParam = (country: string) => {
    const params = new URLSearchParams(searchParams.toString()); // کپی پارامترها
    if (country) {
      params.set("country", country); // اگر مقدار وجود داشت، ست کن
    } else {
      params.delete("country"); // در غیر این صورت حذف کن
    }
    router.push(`${pathname}?${params.toString()}`); // تغییر مسیر با پارامتر جدید
  };

  /**
   * هوک برای واکشی داده‌ها هنگام بارگذاری کامپوننت.
   */
  useEffect(() => {
    // ارسال درخواست به فایل JSON برای دریافت داده‌های مشتریان
    fetch("/data/data.json")
      // تبدیل پاسخ به JSON
      .then((res) => res.json())
      // تنظیم state مشتریان با داده‌های دریافتی
      .then((data) => setClients(data.clients));
  }, []); // آرایه وابستگی خالی برای اجرای تنها یک بار

  /**
   * تابع برای شروع ویرایش یک ردیف خاص.
   * @param id - شناسه مشتری
   */
  const handleEditClick = (id: number): void => {
    setEditingRow(id); // تنظیم ردیف در حال ویرایش به شناسه داده شده
  };

  /**
   * تابع برای ذخیره تغییرات و پایان ویرایش.
   */
  const handleSaveClick = (): void => {
    setEditingRow(null); // بازنشانی ردیف در حال ویرایش به null
  };

  /**
   * تابع برای تغییر مقادیر فیلدهای مشتری.
   * @param id - شناسه مشتری
   * @param field - نام فیلد
   * @param value - مقدار جدید
   */
  const handleChange = (
    id: number,
    field: keyof Client,
    value: string
  ): void => {
    // به‌روزرسانی لیست مشتریان با مقدار جدید فیلد
    setClients((prevClients) =>
      prevClients.map(
        (client) =>
          client.id === id
            ? {
                ...client, // کپی اطلاعات قبلی
                [field]: value, // مقدار جدید فیلد
              }
            : client // اگر id مطابقت نداشت، بدون تغییر
      )
    );
  };

  /**
   * تابع برای حذف یک مشتری.
   * @param id - شناسه مشتری
   */
  const handleDeleteClient = (id: number) => {
    // حذف مشتری با شناسه داده شده از لیست
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
  };

  /**
   * محاسبه مشتریان فیلتر شده بر اساس جستجو و کشور انتخابی.
   */
  const filteredClients = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase(); // پاکسازی و کوچک کردن عبارت جستجو
    // فیلتر کردن مشتریان بر اساس جستجو و کشور
    return clients.filter((client) => {
      return (
        (!trimmedSearch || // اگر جستجو خالی است
          client.name?.toLowerCase().includes(trimmedSearch)) && // یا نام مشتری شامل جستجو باشد
        (!selectedCountry || client.country === selectedCountry)
      ); // و اگر کشور انتخاب شده باشد، باید مطابقت داشته باشد
    });
  }, [clients, searchTerm, selectedCountry]); // اجرای مجدد هنگام تغییر هر یک

  // محاسبه تعداد کل صفحات بر اساس تعداد مشتریان فیلتر شده
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  /**
   * محاسبه مشتریان صفحه‌بندی شده برای نمایش در جدول.
   */
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE; // محاسبه اندیس شروع
    const end = start + ITEMS_PER_PAGE; // محاسبه اندیس پایان
    return filteredClients.slice(start, end); // برش لیست برای صفحه فعلی
  }, [filteredClients, currentPage]); // اجرای مجدد هنگام تغییر هر یک

  /**
   * تابع برای تغییر صفحه.
   * @param page - شماره صفحه جدید
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      // بررسی محدوده صفحه
      setCurrentPage(page); // تنظیم صفحه فعلی
    }
  };

  // بازگشت JSX برای رندر کامپوننت
  return (
    <motion.div
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 mb-8" // استایل کلی با Tailwind
      initial={{ opacity: 0, y: 20 }} // مقدار اولیه انیمیشن
      animate={{ opacity: 1, y: 0 }} // مقدار نهایی انیمیشن
      transition={{ delay: 0.2, duration: 0.5 }} // تنظیمات زمان‌بندی انیمیشن
    >
      {/* هدر جدول */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--text-secondary)] text-center md:text-right">
          لیست مشتریان
        </h2>
      </div>
      {/* بخش جستجو و فیلتر */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* ورودی جستجو */}
        <ClientSearchInput
          value={searchTerm} // مقدار فعلی جستجو
          onChange={(val) => {
            setSearchTerm(val); // به‌روزرسانی state جستجو
            updateSearchParam(val); // به‌روزرسانی پارامتر URL
            setCurrentPage(1); // بازگشت به صفحه اول
          }}
        />
        {/* فیلتر کشور */}
        <ClientCountryFilter
          value={selectedCountry} // مقدار فعلی کشور
          onChange={(val) => {
            setSelectedCountry(val); // به‌روزرسانی state کشور
            updateCountryParam(val); // به‌روزرسانی پارامتر URL
            setCurrentPage(1); // بازگشت به صفحه اول
          }}
        />
      </div>
      {/* جدول مشتریان */}
      <div className=" mt-4 overflow-clip">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {/* عنوان ستون‌ها */}
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                نام
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                ایمیل
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">
                شماره تماس
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
            {/* رندر هر ردیف مشتری با استفاده از ClientTableRow */}
            {paginatedClients.map((client) => (
              <ClientTableRow
                key={client.id} // کلید یکتا برای هر ردیف
                client={client} // ارسال اطلاعات مشتری
                editingRow={editingRow} // ارسال id ردیف در حال ویرایش
                handleEditClick={handleEditClick} // تابع شروع ویرایش
                handleSaveClick={handleSaveClick} // تابع ذخیره تغییرات
                handleChange={handleChange} // تابع تغییر مقدار فیلدها
                handleDeleteClient={handleDeleteClient} // تابع حذف مشتری
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* کامپوننت صفحه‌بندی */}
      <Pagination
        currentPage={currentPage} // شماره صفحه فعلی
        totalPages={totalPages} // تعداد کل صفحات
        onPageChange={handlePageChange} // تابع تغییر صفحه
      />
    </motion.div>
  );
};

export default ClientsTable;
