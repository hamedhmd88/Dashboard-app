/**
 * این کامپوننت ردیف جدول مشتریان را نمایش می‌دهد.
 * امکان ویرایش، ذخیره و حذف مشتری را فراهم می‌کند.
 * طراحی ریسپانسیو برای موبایل و دسکتاپ دارد.
 */
import React from "react"; // ایمپورت کتابخانه React برای ساخت کامپوننت
import Image from "next/image"; // ایمپورت کامپوننت Image از Next.js برای بهینه‌سازی تصاویر
import { Edit, Save, Trash2 } from "lucide-react"; // ایمپورت آیکون‌های ویرایش، ذخیره و حذف
import { Client } from "../../../public/data/dataTypes"; // ایمپورت نوع داده Client برای تایپ‌اسکریپت
import { motion } from "framer-motion"; // ایمپورت motion برای افزودن انیمیشن
import { useTheme } from "../ThemeProvider"; // ایمپورت هوک useTheme برای استفاده از تم فعلی

// اینترفیس پراپس کامپوننت
interface ClientTableRowProps {
  client: Client; // اطلاعات مشتری جاری
  editingRow: number | null; // شناسه ردیفی که در حالت ویرایش است (یا null)
  handleEditClick: (id: number) => void; // تابع برای شروع ویرایش یک ردیف
  handleSaveClick: () => void; // تابع برای ذخیره تغییرات ردیف ویرایش شده
  handleChange: (id: number, field: keyof Client, value: string) => void; // تابع برای تغییر مقدار فیلدهای مشتری
  handleDeleteClient: (id: number) => void; // تابع برای حذف مشتری
}

// کامپوننت اصلی ردیف جدول
const ClientTableRow = ({
  client, // اطلاعات مشتری
  editingRow, // شناسه ردیف در حال ویرایش
  handleEditClick, // تابع شروع ویرایش
  handleSaveClick, // تابع ذخیره تغییرات
  handleChange, // تابع تغییر مقدار فیلدها
  handleDeleteClient, // تابع حذف مشتری
}: ClientTableRowProps) => {
  const { theme } = useTheme(); // دریافت تم فعلی سایت
  return (
    // ردیف جدول با انیمیشن ظاهر شدن (opacity و y)
    <motion.tr
      initial={{ opacity: 0, y: 10 }} // حالت اولیه: محو و کمی پایین‌تر
      animate={{ opacity: 1, y: 0 }} // حالت نهایی: کاملاً نمایان و در جای اصلی
      transition={{ delay: 0.1, duration: 0.3 }} // مدت و تاخیر انیمیشن
      className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0 hover:bg-[var(--component-hover)] rounded-lg
        ${editingRow === client.id ? "bg-[var(--editing-bg)] ring-gray-500" : ""} `}
      // کلاس‌های Tailwind برای ریسپانسیو بودن و استایل‌دهی ردیف
    >
      {/* // نمایش برای موبایل */}
      <td className="md:hidden px-3 py-2">
        <div className="flex items-center justify-between">
          {/* // نمایش تصویر و نام مشتری */}
          <div className="flex items-center">
            <Image
              src={client.image || "/fallback.png"} // آدرس تصویر مشتری یا تصویر پیش‌فرض
              alt={client.name || "مشتری"} // متن جایگزین تصویر
              width={36}
              height={36}
              className="w-9 h-9 rounded-full" // استایل تصویر (دایره‌ای)
            />
            <div className="mr-3">
              <div className="text-base font-medium text-[var(--text-secondary)] text-right">
                {client.name} {/* نمایش نام مشتری */}
              </div>
              <div className="text-base text-[var(--text-secondary)] text-right">
                ایمیل: {client.email} {/* نمایش ایمیل مشتری */}
              </div>
            </div>
          </div>
          {/* دکمه‌های ویرایش/ذخیره و حذف */}
          <div className="flex flex-row-reverse space-x-reverse space-x-1 -mt-1 -mr-1">
            <button
              className="text-indigo-500 hover:text-indigo-300"
              onClick={() =>
                editingRow === client.id
                  ? handleSaveClick() // اگر در حالت ویرایش است، ذخیره کند
                  : client.id !== undefined
                  ? handleEditClick(client.id) // در غیر این صورت، ویرایش را شروع کند
                  : undefined
              }
            >
              {editingRow === client.id ? (
                <Save size={16} /> // آیکون ذخیره اگر در حالت ویرایش باشد
              ) : (
                <Edit size={16} /> // آیکون ویرایش در حالت عادی
              )}
            </button>
            <button
              className="text-red-500 hover:text-red-300"
              onClick={() => {
                if (client.id !== undefined) {
                  handleDeleteClient(client.id); // حذف مشتری با کلیک روی آیکون سطل زباله
                }
              }}
            >
              <Trash2 size={16} /> {/* آیکون حذف */}
            </button>
          </div>
        </div>
        {/* // جزئیات اضافی برای موبایل */}
        <div className="mt-2 text-base text-[var(--text-secondary)] text-right">
          <div>شماره تلفن: {client.phoneNumber}</div> {/* شماره تلفن */}
          <div>کشور: {client.country}</div> {/* کشور */}
          {editingRow === client.id && (
            <>
              <div>
                ایمیل:
                <input
                  type="text"
                  className="bg-transparent text-[var(--foreground)] border border-gray-400 w-40 text-center text-xs mx-1"
                  value={client.email || ""}
                  onChange={(e) => {
                    if (client.id !== undefined) {
                      handleChange(client.id, "email", e.target.value); // تغییر مقدار ایمیل
                    }
                  }}
                />
              </div>
              <div>
                شماره تلفن:
                <input
                  type="text"
                  className="bg-transparent text-[var(--foreground)] border border-gray-400 w-40 text-center text-xs mx-1"
                  value={client.phoneNumber || ""}
                  onChange={(e) => {
                    if (client.id !== undefined) {
                      handleChange(client.id, "phoneNumber", e.target.value); // تغییر مقدار شماره تلفن
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      </td>
      {/* // نمایش نام و تصویر برای دسکتاپ */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base font-medium text-[var(--text-secondary)]">
        <div className="flex items-center justify-start">
          <Image
            src={client.image || "/fallback.png"} // تصویر مشتری یا پیش‌فرض
            alt={client.name || "مشتری"}
            width={50}
            height={50}
            className="w-10 h-10 rounded-full"
          />
          <div className="mr-4">{client.name}</div> {/* نام مشتری */}
        </div>
      </td>
      {/* // فیلد ایمیل با امکان ویرایش */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {editingRow === client.id ? (
          <input
            type="text"
            className="bg-transparent text-[var(--foreground)] border border-gray-400 w-40 text-center text-xs mx-1"
            value={client.email || ""}
            onChange={(e) => {
              if (client.id !== undefined) {
                handleChange(client.id, "email", e.target.value); // تغییر ایمیل
              }
            }}
          />
        ) : (
          client.email // نمایش ایمیل در حالت عادی
        )}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {editingRow === client.id ? (
          <input
            type="text"
            className="bg-transparent text-[var(--foreground)] border border-gray-400 w-40 text-center text-xs mx-1"
            value={client.phoneNumber || ""}
            onChange={(e) => {
              if (client.id !== undefined) {
                handleChange(client.id, "phoneNumber", e.target.value); // تغییر شماره تلفن
              }
            }}
          />
        ) : (
          client.phoneNumber // نمایش شماره تلفن در حالت عادی
        )}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {client.country} {/* نمایش کشور مشتری */}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right ">
        <button
          className="text-indigo-500 hover:text-indigo-300 ml-4"
          onClick={() =>
            editingRow === client.id
              ? handleSaveClick() // ذخیره تغییرات اگر در حالت ویرایش باشد
              : client.id !== undefined
              ? handleEditClick(client.id) // شروع ویرایش در حالت عادی
              : undefined
          }
        >
          {editingRow === client.id ? <Save size={16} /> : <Edit size={16} />}
        </button>
        <button
          className="text-red-500 hover:text-red-300"
          onClick={() => {
            if (client.id !== undefined) {
              handleDeleteClient(client.id); // حذف مشتری
            }
          }}
        >
          <Trash2 size={16} />
        </button>
      </td>
    </motion.tr>
  );
};

// اکسپورت کامپوننت
export default ClientTableRow; // خروجی گرفتن کامپوننت برای استفاده در سایر بخش‌ها


