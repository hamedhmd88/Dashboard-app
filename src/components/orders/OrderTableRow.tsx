import React from "react";
import { Edit, Save, Trash2 } from "lucide-react";
import { Order } from "../../../public/data/dataTypes";
import { motion } from "framer-motion";

interface OrderTableRowProps {
  order: Order;
  editingRow: string | null;
  handleEditClick: (id: string) => void;
  handleSaveClick: () => void;
  handleChange: (id: string, field: keyof Order, value: string) => void;
  handleDeleteOrder: (id: string) => void;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "تحویل داده شده": return "bg-green-800";
    case "لغو شده": return "bg-red-800";
    case "در انتظار": return "bg-yellow-800";
    default: return "bg-gray-800";
  }
};

const OrderTableRow = ({
  order,
  editingRow,
  handleEditClick,
  handleSaveClick,
  handleChange,
  handleDeleteOrder,
}: OrderTableRowProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0  
        ${editingRow === order.id ? "bg-[var(--editing-bg)] ring-gray-500" : ""}`}
    >
      {/* Mobile view */}
      <td className="md:hidden px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <div className="text-base font-medium text-[var(--text-secondary)] text-right">
                شناسه: {order.id}
              </div>
              <div className="text-base text-[var(--text-secondary)] text-right">
                {order.client}
              </div>
              <div className="text-sm text-[var(--text-secondary)] text-right">
                {order.email}
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse space-x-reverse space-x-1 -mt-1 -mr-1">
            <button
              className="text-indigo-500 hover:text-indigo-300"
              onClick={() =>
                editingRow === order.id
                  ? handleSaveClick()
                  : order.id !== undefined
                  ? handleEditClick(order.id)
                  : undefined
              }
            >
              {editingRow === order.id ? (
                <Save size={16} />
              ) : (
                <Edit size={16} />
              )}
            </button>
            <button
              className="text-red-500 hover:text-red-300"
              onClick={() => {
                if (order.id !== undefined) {
                  handleDeleteOrder(order.id);
                }
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="mt-2 text-base text-[var(--text-secondary)] text-right">
          <div>جمع: {editingRow === order.id ? (
            <input
              type="text"
              className="bg-transparent text-[var(--foreground)] border border-gray-400 w-20 text-center text-xs mx-1"
              value={order.total}
              onChange={(e) => {
                if (order.id !== undefined) {
                  handleChange(order.id, "total", e.target.value);
                }
              }}
            />
          ) : (
            `${Number(order.total).toLocaleString("fa-IR")} تومان`
          )}</div>
          <div>وضعیت: {editingRow === order.id ? (
            <select
              value={order.status}
              onChange={(e) => {
                if (order.id !== undefined) {
                  handleChange(order.id, "status", e.target.value);
                }
              }}
              className="bg-[var(--component-bg)] text-[var(--foreground)] border border-gray-400 text-xs mx-1"
            >
              <option value="در انتظار">در انتظار</option>
              <option value="در حال پردازش">در حال پردازش</option>
              <option value="لغو شده">لغو شده</option>
              <option value="تحویل داده شده">تحویل داده شده</option>
            </select>
          ) : (
            <span className={`text-[var(--foreground)] px-2 py-1 rounded ${getStatusClass(order.status || "")}`}>{order.status}</span>
          )}</div>
          <div>کشور: {order.country}</div>
        </div>
      </td>

      {/* Desktop view */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {order.id}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        <div>{order.client}</div>
        <div className="text-sm text-[var(--text-secondary)]">{order.email}</div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {editingRow === order.id ? (
          <input
            type="text"
            className="bg-transparent text-[var(--foreground)] border border-gray-400 w-20 text-center text-xs mx-1"
            value={order.total}
            onChange={(e) => {
              if (order.id !== undefined) {
                handleChange(order.id, "total", e.target.value);
              }
            }}
          />
        ) : (
          `${Number(order.total).toLocaleString("fa-IR")} تومان`
        )}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {editingRow === order.id ? (
          <select
            value={order.status}
            onChange={(e) => {
              if (order.id !== undefined) {
                handleChange(order.id, "status", e.target.value);
              }
            }}
            className="bg-[var(--component-bg)] text-[var(--foreground)] border border-gray-400 text-xs mx-1"
          >
            <option value="در انتظار">در انتظار</option>
            <option value="لغو شده">لغو شده</option>
            <option value="تحویل داده شده">تحویل داده شده</option>
          </select>
        ) : (
          <span className={`text-[var(--foreground)] px-2 py-1 rounded ${getStatusClass(order.status || "")}`}>{order.status}</span>
        )}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {order.country}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
        <div className="flex space-x-4 -mx-2">
          <button
            className="text-indigo-500 hover:text-indigo-300 mr-1 cursor-pointer"
            onClick={() =>
              editingRow === order.id
                ? handleSaveClick()
                : order.id !== undefined
                ? handleEditClick(order.id)
                : undefined
            }
          >
            {editingRow === order.id ? (
              <Save size={18} />
            ) : (
              <Edit size={18} />
            )}
          </button>
          <button
            className="text-red-500 hover:text-red-300 cursor-pointer"
            onClick={() => {
              if (order.id !== undefined) {
                handleDeleteOrder(order.id);
              }
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export default OrderTableRow;

