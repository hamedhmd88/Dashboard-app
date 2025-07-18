"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Order } from "../../../public/data/dataTypes";
import OrderSearchInput from "./OrderSearchInput";
import OrderStatusFilter from "./OrderStatusFilter";
import OrderCountryFilter from "./OrderCountryFilter";
import Pagination from "../Pagination";
import OrderTableRow from "./OrderTableRow";

const ITEMS_PER_PAGE = 4;

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders));
  }, []);

  const handleEditClick = (id: string): void => {
    setEditingRow(id);
  };

  const handleSaveClick = (): void => {
    setEditingRow(null);
  };

  const handleChange = (
    id: string,
    field: keyof Order,
    value: string
  ): void => {
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

  const handleDeleteOrder = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  const filteredOrders = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const trimmedStatus = status.trim();
    const trimmedCountry = country.trim();

    return orders.filter((order) => {
      const matchesSearch =
        !trimmedSearch || order.client?.toLowerCase().includes(trimmedSearch);

      const matchesStatus = !trimmedStatus || order.status === trimmedStatus;
      const matchesCountry =
        !trimmedCountry || order.country === trimmedCountry;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [orders, searchTerm, status, country]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--text-secondary)] text-center md:text-right">
          لیست سفارشات
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <OrderSearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
        />
        <OrderStatusFilter
          value={status}
          onChange={(val) => {
            setStatus(val);
            setCurrentPage(1);
          }}
        />
        <OrderCountryFilter
          value={country}
          onChange={(val) => {
            setCountry(val);
            setCurrentPage(1);
          }}
        />
      </div>

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
};

export default OrdersTable;


