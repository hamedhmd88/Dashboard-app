"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "../../../public/data/dataTypes";
import ProductSearchInput from "./ProductSearchInput";
import ProductCategoryFilter from "./ProductCategoryFilter";
import Pagination from "../Pagination";
import ProductTableRow from "./ProductTableRow";
import TableHeader from "../TableHeader";

const ITEMS_PER_PAGE = 4;

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingRow, setEditingRow] = useState<number | string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  // تابعی برای شروع ویرایش یک ردیف خاص در جدول
  const handleEditClick = (id: number | string): void => {
    // مقدار شناسه ردیف در حال ویرایش را ذخیره می‌کنیم
    setEditingRow(id);
  };

  // تابعی برای پایان عملیات ویرایش
  const handleSaveClick = (): void => {
    // مقدار ردیف در حال ویرایش را پاک می‌کنیم (خروج از حالت ویرایش)
    setEditingRow(null);
  };

  // تابعی برای کنترل تغییر مقدار فیلدهای قابل ویرایش در یک ردیف خاص
  const handleChange = (
    id: number | string, // شناسه‌ی محصول موردنظر
    field: keyof Product, // فیلدی که کاربر مقدار آن را تغییر داده
    value: string // مقدار جدید که وارد شده (به صورت رشته)
  ): void => {
    // اگر مقدار فقط شامل عدد یا اعشار نباشد، تابع را متوقف کن
    if (!/^\d*\.?\d*$/.test(value)) return;

    // بروزرسانی لیست محصولات با مقدار جدید
    setProducts((prevProducts) =>
      prevProducts.map(
        (product) =>
          // فقط اگر id محصول مطابق باشد، مقدار جدید را ست کن
          product.id === id
            ? {
                ...product, // حفظ سایر مقادیر محصول
                [field]: Number(value), // مقدار جدید برای فیلد مشخص‌شده
              }
            : product // در غیر اینصورت، محصول را بدون تغییر برگردان
      )
    );
  };

  // تابع حذف محصول بر اساس id
  const handleDeleteProduct = (id: number | string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  // محاسبه محصولات فیلتر شده براساس عبارت جستجو و دسته‌بندی انتخاب شده
  const filteredProducts = useMemo(() => {
    // حذف فاصله‌های اضافی و تبدیل به حروف کوچک برای تطبیق بهتر جستجو
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const trimmedCategory = category.trim();

    // فیلتر کردن محصولات
    return products.filter((product) => {
      // بررسی اینکه آیا نام یا دسته‌ی محصول با عبارت جستجو مطابقت دارد
      const matchesSearch =
        !trimmedSearch || // اگر چیزی برای جستجو وارد نشده، همه نتایج را نشان بده
        product.name?.toLowerCase().includes(trimmedSearch) || // تطبیق با نام محصول
        product.category?.toLowerCase().includes(trimmedSearch); // یا تطبیق با دسته‌بندی

      // بررسی اینکه آیا دسته‌بندی انتخاب شده با دسته‌ی محصول یکی است
      const matchesCategory =
        !trimmedCategory || product.category === trimmedCategory;

      // فقط محصولاتی که هم با جستجو و هم با دسته مطابقت دارند، نگه‌دار
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, category]); // فقط وقتی این مقادیر تغییر کنند، محاسبه مجدد انجام می‌شود

  // محاسبه تعداد کل صفحات براساس تعداد محصولات فیلتر شده و تعداد آیتم‌ها در هر صفحه
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // گرفتن فقط محصولات صفحه‌ی فعلی از میان لیست فیلتر شده
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE; // محاسبه ایندکس شروع
    const end = start + ITEMS_PER_PAGE; // محاسبه ایندکس پایان (غیرشامل)
    return filteredProducts.slice(start, end); // استخراج محصولات مربوط به صفحه فعلی
  }, [filteredProducts, currentPage]); // فقط زمانی که لیست یا صفحه تغییر کند، محاسبه مجدد انجام می‌شود

  // تابع تغییر صفحه: اگر شماره صفحه معتبر باشد، صفحه را به‌روزرسانی می‌کند
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // تنظیم صفحه‌ی جدید
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
          لیست محصولات
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ProductSearchInput
          value={searchTerm}
          onChange={(val) => {
            // ذخیره مقدار جستجوی جدید در state
            setSearchTerm(val);
            // برگرداندن به صفحه اول: برای جلوگیری از نمایش نتایج خالی در صفحات بالا
            // و همچنین بهبود تجربه کاربری (نمایش نتایج از ابتدا)
            setCurrentPage(1);
          }}
        />
        <ProductCategoryFilter
          value={category}
          onChange={(val) => {
            // ذخیره دسته‌بندی انتخاب‌شده
            setCategory(val);
            // با هر فیلتر جدید، از صفحه اول نتایج رو شروع کن
            // چون ممکنه در صفحات بعدی هیچ نتیجه‌ای برای فیلتر انتخابی وجود نداشته باشه
            setCurrentPage(1);
          }}
        />
      </div>

      <div className=" mt-4 overflow-clip">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <TableHeader />
          </thead>
          <tbody className="divide-y divide-gray-500">
            {paginatedProducts.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                editingRow={editingRow}
                handleEditClick={handleEditClick}
                handleSaveClick={handleSaveClick}
                handleChange={handleChange}
                handleDeleteProduct={handleDeleteProduct}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
};

export default ProductsTable;
