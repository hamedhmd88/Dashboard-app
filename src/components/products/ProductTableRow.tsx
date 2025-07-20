// ایمپورت کتابخانه‌های مورد نیاز
import React from "react";
import Image from "next/image";
import { Edit, Save, Trash2 } from "lucide-react"; // آیکون‌ها
import { Product } from "../../../public/data/dataTypes"; // نوع داده‌ی محصول
import { motion } from "framer-motion"; // برای انیمیشن
import { useTheme } from "../ThemeProvider";

// تعریف پراپرتی‌های مورد انتظار از کامپوننت
interface ProductTableRowProps {
  product: Product; // داده‌های مربوط به یک محصول
  editingRow: number | string | null; // مشخص‌کننده اینکه کدام ردیف در حال ویرایش است
  handleEditClick: (id: number | string) => void; // شروع ویرایش
  handleSaveClick: () => void; // ذخیره تغییرات
  handleChange: (
    id: number | string,
    field: keyof Product,
    value: string
  ) => void; // تغییر مقادیر فیلدها
  handleDeleteProduct: (id: number | string) => void; // حذف محصول
}

// تعریف کامپوننت ProductTableRow
const ProductTableRow = ({
  product,
  editingRow,
  handleEditClick,
  handleSaveClick,
  handleChange,
  handleDeleteProduct,
}: ProductTableRowProps) => {
  const { theme } = useTheme();
  return (
    // استفاده از framer-motion برای انیمیشن هنگام رندر سطر جدول
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0  hover:bg-[var(--component-hover)] rounded-lg 
        ${editingRow === product.id ? "bg-[var(--editing-bg)] ring-gray-500" : ""} `}
    >
      {/* نمای موبایل (td برای موبایل قابل مشاهده است) */}
      <td className="md:hidden px-3 py-2">
        {/* قسمت بالای اطلاعات با تصویر و نام محصول */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={product.image || "/fallback.png"} // تصویر محصول یا تصویر پیش‌فرض
              alt={product.name || "محصول"}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full"
            />
            <div className="mr-3">
              <div className="text-base font-medium text-[var(--text-secondary)] text-right">
                {product.name}
              </div>
              <div className="text-base text-[var(--text-secondary)] text-right">
                شناسه: {product.id}
              </div>
            </div>
          </div>

          {/* دکمه‌های ویرایش/ذخیره و حذف */}
          <div className="flex flex-row-reverse space-x-reverse space-x-1 -mt-1 -mr-1">
            <button
              className="text-indigo-500 hover:text-indigo-300"
              onClick={() =>
                editingRow === product.id
                  ? handleSaveClick()
                  : product.id !== undefined
                  ? handleEditClick(product.id)
                  : undefined
              }
            >
              {/* اگر در حال ویرایش باشد آیکون ذخیره، در غیر این صورت آیکون ویرایش */}
              {editingRow === product.id ? (
                <Save size={16} />
              ) : (
                <Edit size={16} />
              )}{" "}
            </button>
            <button
              className="text-red-500 hover:text-red-300"
              onClick={() => {
                if (product.id !== undefined) {
                  handleDeleteProduct(product.id); // حذف محصول
                }
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* اطلاعات دیگر مانند دسته‌بندی، قیمت، موجودی، فروش */}
        <div className="mt-2 text-base text-[var(--text-secondary)] text-right">
          <div>دسته‌بندی: {product.category}</div>
          {["قیمت", "موجودی", "فروش"].map((label) => {
            const fieldKey =
              label === "قیمت"
                ? "price"
                : label === "موجودی"
                ? "stock"
                : "sales";

            const value = Number(product[fieldKey]);

            return (
              <div key={label} className="text-base">
                <span>{label}: </span>
                {editingRow === product.id ? (
                  <input
                    type="text"
                    className="bg-transparent text-[var(--foreground)] border border-gray-400 w-20 text-center text-xs mx-1"
                    value={product[fieldKey] as any}
                    onChange={(e) => {
                      if (product.id !== undefined) {
                        handleChange(
                          product.id,
                          fieldKey as keyof Product,
                          e.target.value
                        );
                      }
                    }}
                  />
                ) : label === "قیمت" ? (
                  <>{value.toLocaleString("fa-IR")} تومان</>
                ) : label === "موجودی" ? (
                  <>{value.toLocaleString("fa-IR")} عدد در انبار</>
                ) : (
                  <>{value.toLocaleString("fa-IR")} فروش</>
                )}
              </div>
            );
          })}
        </div>
      </td>

      {/* نمایش اطلاعات در نسخه دسکتاپ */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base font-medium text-[var(--text-secondary)]">
        <div className="flex items-center justify-start">
          <Image
            src={product.image || "/fallback.png"}
            alt={product.name || "محصول"}
            width={50}
            height={50}
            className="w-10 h-10 rounded-full"
          />
          <div className="mr-4">{product.name}</div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {product.id}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {product.category}
      </td>

      {/* فیلد قیمت با امکان ویرایش */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {editingRow === product.id ? (
          <input
            type="text"
            className="bg-transparent text-[var(--foreground)] border border-gray-400 w-20 text-center text-xs mx-1"
            value={product.price}
            onChange={(e) => {
              if (product.id !== undefined) {
                handleChange(product.id, "price", e.target.value);
              }
            }}
          />
        ) : (
          `${Number(product.price).toLocaleString("fa-IR")} تومان`
        )}
      </td>

      {/* فیلد موجودی */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {editingRow === product.id ? (
          <input
            type="text"
            className="bg-transparent text-[var(--foreground)] border border-gray-400 w-20 text-center text-xs mx-1"
            value={product.stock}
            onChange={(e) => {
              if (product.id !== undefined) {
                handleChange(product.id, "stock", e.target.value);
              }
            }}
          />
        ) : (
          `${Number(product.stock).toLocaleString("fa-IR")} عدد در انبار`
        )}
      </td>

      {/* فیلد فروش */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-[var(--text-secondary)] text-right">
        {editingRow === product.id ? (
          <input
            type="text"
            className="bg-transparent text-[var(--foreground)] border border-gray-400 w-20 text-center text-xs mx-1"
            value={product.sales}
            onChange={(e) => {
              if (product.id !== undefined) {
                handleChange(product.id, "sales", e.target.value);
              }
            }}
          />
        ) : (
          `${Number(product.sales).toLocaleString("fa-IR")} فروش`
        )}
      </td>

      {/* دکمه‌های ویرایش/ذخیره و حذف در دسکتاپ */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
        <div className="flex space-x-4 -mx-2">
          <button
            className="text-indigo-500 hover:text-indigo-300 mr-1 cursor-pointer"
            onClick={() =>
              editingRow === product.id
                ? handleSaveClick()
                : product.id !== undefined
                ? handleEditClick(product.id)
                : undefined
            }
          >
            {editingRow === product.id ? (
              <Save size={18} />
            ) : (
              <Edit size={18} />
            )}
          </button>
          <button
            className="text-red-500 hover:text-red-300 cursor-pointer"
            onClick={() => {
              if (product.id !== undefined) {
                handleDeleteProduct(product.id);
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

export default ProductTableRow;


