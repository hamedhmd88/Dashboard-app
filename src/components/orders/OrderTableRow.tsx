// این کامپوننت یک ردیف از جدول سفارشات را نمایش می‌دهد و قابلیت ویرایش و حذف هر سفارش را فراهم می‌کند
import React from "react";
// هوک برای دریافت تم فعلی (روشن یا تاریک)
import { useTheme } from "../ThemeProvider";
// آیکون‌های ویرایش، ذخیره و حذف از کتابخانه lucide-react
import { Edit, Save, Trash2 } from "lucide-react";
// نوع داده سفارش که ساختار هر سفارش را مشخص می‌کند
import { Order } from "../../../public/data/dataTypes";
// کتابخانه framer-motion برای انیمیشن دادن به ردیف جدول
import { motion } from "framer-motion";

// تعریف نوع پراپرتی‌هایی که این کامپوننت دریافت می‌کند
interface OrderTableRowProps {
  order: Order; // شیء سفارش فعلی
  editingRow: string | null; // شناسه ردیفی که در حال ویرایش است
  handleEditClick: (id: string) => void; // تابع برای شروع ویرایش
  handleSaveClick: () => void; // تابع برای ذخیره تغییرات
  handleChange: (id: string, field: keyof Order, value: string) => void; // تابع برای تغییر مقدار فیلدها
  handleDeleteOrder: (id: string) => void; // تابع برای حذف سفارش
}

// تابعی برای تعیین کلاس رنگ وضعیت سفارش بر اساس مقدار وضعیت
const getStatusClass = (status: string) => {
  switch (status) {
    case "تحویل داده شده":
      return "bg-green-800"; // اگر سفارش تحویل داده شده باشد، پس‌زمینه سبز
    case "لغو شده":
      return "bg-red-800"; // اگر سفارش لغو شده باشد، پس‌زمینه قرمز
    case "در انتظار":
      return "bg-yellow-800"; // اگر سفارش در انتظار باشد، پس‌زمینه زرد
    default:
      return "bg-gray-800"; // در غیر این صورت، پس‌زمینه خاکستری
  }
};

// تعریف کامپوننت اصلی ردیف جدول سفارشات
const OrderTableRow = ({
  order,
  editingRow,
  handleEditClick,
  handleSaveClick,
  handleChange,
  handleDeleteOrder,
}: OrderTableRowProps) => {
  // دریافت تم فعلی از کانتکست
  const { theme } = useTheme();

  return (
    // استفاده از motion.tr برای افزودن انیمیشن به ردیف جدول
    <motion.tr
      initial={{ opacity: 0, y: 10 }} // مقدار اولیه انیمیشن (محو و کمی پایین)
      animate={{ opacity: 1, y: 0 }} // مقدار نهایی انیمیشن (نمایان و در جای اصلی)
      transition={{ delay: 0.1, duration: 0.3 }} // مدت و تاخیر انیمیشن
      className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0 hover:bg-[var(--component-hover)] rounded-lg 
        ${
          editingRow === order.id ? "bg-[var(--editing-bg)] ring-gray-500" : ""
        }`}
    >
      {/* نمای موبایل */}
      <td className="md:hidden px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              {/* نمایش شناسه سفارش */}
              <div className="text-base font-medium text-[var(--text-secondary)] text-right">
                شناسه: {order.id}
              </div>
              {/* نمایش نام مشتری */}
              <div className="text-base text-[var(--text-secondary)] text-right">
                {order.client}
              </div>
              {/* نمایش ایمیل مشتری */}
              <div className="text-sm text-[var(--text-secondary)] text-right">
                {order.email}
              </div>
            </div>
          </div>
          {/* دکمه‌های ویرایش و حذف */}
          <div className="flex flex-row-reverse space-x-reverse space-x-1 -mt-1 -mr-1">
            <button
              className="text-indigo-500 hover:text-indigo-300"
              onClick={() =>
                editingRow === order.id
                  ? handleSaveClick() // اگر در حالت ویرایش است، ذخیره کند
                  : order.id !== undefined
                  ? handleEditClick(order.id) // در غیر این صورت، وارد حالت ویرایش شود
                  : undefined
              }
            >
              {/* نمایش آیکون ذخیره یا ویرایش بر اساس حالت */}
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
                  handleDeleteOrder(order.id); // حذف سفارش
                }
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="mt-2 text-base text-[var(--text-secondary)] text-right">
          <div>
            {/* نمایش یا ویرایش جمع مبلغ سفارش */}
            جمع:{" "}
            {editingRow === order.id ? (
              <input
                type="text"
                className="bg-transparent text-[var(--foreground)] border border-gray-400 w-20 text-center text-xs mx-1"
                value={order.total}
                onChange={(e) => {
                  if (order.id !== undefined) {
                    handleChange(order.id, "total", e.target.value); // تغییر مقدار جمع
                  }
                }}
              />
            ) : (
              `${Number(order.total).toLocaleString("fa-IR")} تومان`
            )}
          </div>
          <div>
            {/* نمایش یا ویرایش وضعیت سفارش */}
            وضعیت:{" "}
            {editingRow === order.id ? (
              <select
                value={order.status}
                onChange={(e) => {
                  if (order.id !== undefined) {
                    handleChange(order.id, "status", e.target.value); // تغییر وضعیت
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
              <span
                className={`px-2 py-1 rounded ${getStatusClass(
                  order.status || ""
                )} ${
                  theme === "light" ? "text-white" : "text-[var(--foreground)]"
                }`}
              >
                {order.status}
              </span>
            )}
          </div>
          {/* نمایش کشور سفارش */}
          <div>کشور: {order.country}</div>
        </div>
      </td>

      {/* نمای دسکتاپ */}
      {/* ستون شناسه سفارش */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {order.id}
      </td>
      {/* ستون نام و ایمیل مشتری */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        <div>{order.client}</div>
        <div className="text-sm text-[var(--text-secondary)]">
          {order.email}
        </div>
      </td>
      {/* ستون جمع مبلغ سفارش */}
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
      {/* ستون وضعیت سفارش */}
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
          <span
            className={`px-2 py-1 rounded ${getStatusClass(
              order.status || ""
            )} ${
              theme === "light" ? "text-white" : "text-[var(--foreground)]"
            }`}
          >
            {order.status}
          </span>
        )}
      </td>
      {/* ستون کشور */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {order.country}
      </td>
      {/* ستون دکمه‌های عملیات (ویرایش و حذف) */}
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
            {/* نمایش آیکون ذخیره یا ویرایش */}
            {editingRow === order.id ? <Save size={18} /> : <Edit size={18} />}
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

// خروجی گرفتن کامپوننت برای استفاده در سایر بخش‌ها
export default OrderTableRow;
