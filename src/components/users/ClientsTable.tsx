/**
 * این کامپوننت جدول مشتریان را مدیریت و نمایش می‌دهد.
 * داده‌ها را از data.json واکشی می‌کند.
 * جستجو، فیلتر کشور، صفحه‌بندی و عملیات CRUD را پشتیبانی می‌کند.
 */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Client } from "../../../public/data/dataTypes";
import ClientSearchInput from "./ClientSearchInput";
import Pagination from "../Pagination";
import ClientTableRow from "./ClientTableRow";

const ITEMS_PER_PAGE = 4;

const ClientsTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setClients(data.clients));
  }, []);

  const handleEditClick = (id: number): void => {
    setEditingRow(id);
  };

  const handleSaveClick = (): void => {
    setEditingRow(null);
  };

  const handleChange = (
    id: number,
    field: keyof Client,
    value: string
  ): void => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === id
          ? {
              ...client,
              [field]: value,
            }
          : client
      )
    );
  };

  const handleDeleteClient = (id: number) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
  };

  const filteredClients = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    return clients.filter((client) => {
      return (
        !trimmedSearch ||
        client.name?.toLowerCase().includes(trimmedSearch) ||
        client.email?.toLowerCase().includes(trimmedSearch) ||
        client.country?.toLowerCase().includes(trimmedSearch)
      );
    });
  }, [clients, searchTerm]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredClients.slice(start, end);
  }, [filteredClients, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div
      className="bg-[#0A0A0A] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-300 text-center md:text-right">
          لیست مشتریان
        </h2>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ClientSearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className=" mt-4 overflow-clip">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-gray-400 hidden md:table-cell">نام</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-gray-400 hidden md:table-cell">ایمیل</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-gray-400 hidden md:table-cell">شماره تماس</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-gray-400 hidden md:table-cell">کشور</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-gray-400 hidden md:table-cell">عملیات</th>
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