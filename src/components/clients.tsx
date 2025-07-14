/**
 * این کامپوننت جدول مشتریان را مدیریت و نمایش می‌دهد.
 * داده‌ها را از data.json واکشی می‌کند.
 * جستجو، فیلتر کشور، صفحه‌بندی و عملیات CRUD را پشتیبانی می‌کند.
 */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Client } from "../../public/data/dataTypes";
import ClientSearchInput from "./ClientSearchInput";
import ClientCountryFilter from "./ClientCountryFilter";
import Pagination from "./Pagination";
import ClientTableRow from "./ClientTableRow";
import ClientTableHeader from "./ClientTableHeader";

// تعداد آیتم‌ها در هر صفحه
const ITEMS_PER_PAGE = 4;

// کامپوننت اصلی جدول مشتریان
const ClientsTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // واکشی داده‌های مشتریان در هنگام لود
  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setClients(data.clients));
  }, []);

  // هندلر کلیک ویرایش
  const handleEditClick = (id: number): void => {
    setEditingRow(id);
  };

  // هندلر کلیک ذخیره
  const handleSaveClick = (): void => {
    setEditingRow(null);
  };

  // هندلر تغییرات فیلد
  const handleChange = (
    id: number,
    field: keyof Client,
    value: string
  ): void => {
    setClients((prevClients) =>
      prevClients.map(
        (client) =>
          client.id === id
            ? {
                ...client,
                [field]: value,
              }
            : client
      )
    );
  };

  // هندلر حذف مشتری
  const handleDeleteClient = (id: number) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
  };

  // فیلتر مشتریان بر اساس جستجو و کشور
  const filteredClients = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const trimmedCountry = country.trim();

    return clients.filter((client) => {
      const matchesSearch =
        !trimmedSearch ||
        client.name?.toLowerCase().includes(trimmedSearch) ||
        client.email?.toLowerCase().includes(trimmedSearch);

      const matchesCountry =
        !trimmedCountry || client.country === trimmedCountry;

      return matchesSearch && matchesCountry;
    });
  }, [clients, searchTerm, country]);

  // محاسبه تعداد صفحات
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  // صفحه‌بندی مشتریان فیلتر شده
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredClients.slice(start, end);
  }, [filteredClients, currentPage]);

  // هندلر تغییر صفحه
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // رندر کامپوننت
  return (
    <motion.div
      className="bg-[#0A0A0A] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* // هدر جدول با عنوان */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-300 text-center md:text-right">
          لیست مشتریان
        </h2>
      </div>

      {/* // ورودی جستجو و فیلتر کشور */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ClientSearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
        />
        <ClientCountryFilter
          value={country}
          onChange={(val) => {
            setCountry(val);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* // جدول مشتریان */}
      <div className=" mt-4 overflow-clip">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <ClientTableHeader />
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

// اکسپورت کامپوننت
export default ClientsTable;