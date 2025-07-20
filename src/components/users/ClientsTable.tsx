/**
 * این کامپوننت جدول مشتریان را مدیریت و نمایش می‌دهد.
 * داده‌ها را از data.json واکشی می‌کند.
 * جستجو، فیلتر کشور، صفحه‌بندی و عملیات CRUD را پشتیبانی می‌کند.
 */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Client } from "../../../public/data/dataTypes";
import ClientSearchInput from "./ClientSearchInput";
import Pagination from "../Pagination";
import ClientTableRow from "./ClientTableRow";
import ClientCountryFilter from "./ClientCountryFilter";

const ITEMS_PER_PAGE = 4;

  /** 
   * کامپوننت اصلی جدول مشتریان که داده‌ها را مدیریت و نمایش می‌دهد.
   */
  const ClientsTable = () => {
    // تعریف حالت برای لیست مشتریان
    const [clients, setClients] = useState<Client[]>([]);
    // تعریف حالت برای ردیف در حال ویرایش
    const [editingRow, setEditingRow] = useState<number | null>(null);
    // تعریف حالت برای عبارت جستجو
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedCountry, setSelectedCountry] = useState<string>("");

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const search = searchParams.get("search") || "";
      const country = searchParams.get("country") || "";
      setSearchTerm(search);
      setSelectedCountry(country);
    }, [searchParams]);

    const updateSearchParam = (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    };

    const updateCountryParam = (country: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (country) {
        params.set("country", country);
      } else {
        params.delete("country");
      }
      router.push(`${pathname}?${params.toString()}`);
    };
    /**
     * هوک برای واکشی داده‌ها هنگام بارگذاری کامپوننت.
     */
    useEffect(() => {
      // ارسال درخواست به فایل JSON
      fetch("/data/data.json")
        // تبدیل پاسخ به JSON
        .then((res) => res.json())
        // تنظیم حالت مشتریان با داده‌های دریافتی
        .then((data) => setClients(data.clients));
    }, []); // آرایه وابستگی خالی برای اجرای تنها یک بار

    /**
     * تابع برای شروع ویرایش یک ردیف خاص.
     * @param id - شناسه مشتری
     */
    const handleEditClick = (id: number): void => {
      // تنظیم ردیف در حال ویرایش به شناسه داده شده
      setEditingRow(id);
    };

    /**
     * تابع برای ذخیره تغییرات و پایان ویرایش.
     */
    const handleSaveClick = (): void => {
      // بازنشانی ردیف در حال ویرایش به null
      setEditingRow(null);
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
      // به‌روزرسانی لیست مشتریان
      setClients((prevClients) =>
        // نقشه‌برداری روی مشتریان قبلی
        prevClients.map((client) =>
          // بررسی اگر شناسه مطابقت دارد
          client.id === id
            ? {
                // کپی مشتری و به‌روزرسانی فیلد
                ...client,
                [field]: value,
              }
            : client // بازگشت مشتری بدون تغییر
        )
      );
    };

    /**
     * تابع برای حذف یک مشتری.
     * @param id - شناسه مشتری
     */
    const handleDeleteClient = (id: number) => {
      // به‌روزرسانی لیست مشتریان با فیلتر کردن
      setClients((prevClients) =>
        // حذف مشتری با شناسه داده شده
        prevClients.filter((client) => client.id !== id)
      );
    };

    /**
     * محاسبه مشتریان فیلتر شده بر اساس جستجو.
     */
    const filteredClients = useMemo(() => {
      // پاکسازی عبارت جستجو و تبدیل به حروف کوچک
      const trimmedSearch = searchTerm.trim().toLowerCase();
      // فیلتر کردن لیست مشتریان
      return clients.filter((client) => {
        // شرط بازگشت true اگر جستجو خالی است یا مطابقت دارد
        return (
          !trimmedSearch ||
          client.name?.toLowerCase().includes(trimmedSearch)
    
        ) && (!selectedCountry || client.country === selectedCountry);
      });
    }, [clients, searchTerm, selectedCountry]); // وابستگی‌ها برای به‌روزرسانی

    // محاسبه تعداد صفحات کل
    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

    /**
     * محاسبه مشتریان صفحه‌بندی شده.
     */
    const paginatedClients = useMemo(() => {
      // محاسبه شروع صفحه
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      // محاسبه پایان صفحه
      const end = start + ITEMS_PER_PAGE;
      // برش لیست فیلتر شده
      return filteredClients.slice(start, end);
    }, [filteredClients, currentPage]); // وابستگی‌ها برای به‌روزرسانی

    /**
     * تابع برای تغییر صفحه.
     * @param page - شماره صفحه جدید
     */
    const handlePageChange = (page: number) => {
      // بررسی محدوده صفحه
      if (page >= 1 && page <= totalPages) {
        // تنظیم صفحه فعلی
        setCurrentPage(page);
      }
    };

    // بازگشت JSX برای رندر کامپوننت
    return (
    <motion.div
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--text-secondary)] text-center md:text-right">
          لیست مشتریان
        </h2>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ClientSearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            updateSearchParam(val);
            setCurrentPage(1);
          }}
        />
        <ClientCountryFilter
          value={selectedCountry}
          onChange={(val) => {
            setSelectedCountry(val);
            updateCountryParam(val);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className=" mt-4 overflow-clip">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">نام</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">ایمیل</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">شماره تماس</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">کشور</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {paginatedClients.map((client) => (
              <ClientTableRow
                key={client.id}
                client={client}
                editingRow={editingRow}
                handleEditClick={handleEditClick}
                handleSaveClick={handleSaveClick}
                handleChange={handleChange}
                handleDeleteClient={handleDeleteClient}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
};

export default ClientsTable;

