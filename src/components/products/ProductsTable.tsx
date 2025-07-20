// این کامپوننت جدول محصولات را نمایش می‌دهد و امکانات جستجو، فیلتر، ویرایش، حذف و صفحه‌بندی را فراهم می‌کند
"use client"; // این فایل یک کامپوننت کلاینتی است (در Next.js)
import React, { useEffect, useMemo, useState } from "react"; // ایمپورت ری‌اکت و هوک‌های مورد نیاز
import { useSearchParams, useRouter, usePathname } from "next/navigation"; // هوک‌های ناوبری و مدیریت پارامترهای جستجو در Next.js
import { motion } from "framer-motion"; // برای انیمیشن دادن به کامپوننت
import { Product } from "../../../public/data/dataTypes"; // نوع داده محصول
import ProductSearchInput from "./ProductSearchInput"; // کامپوننت ورودی جستجوی محصول
import ProductCategoryFilter from "./ProductCategoryFilter"; // کامپوننت فیلتر دسته‌بندی محصول
import Pagination from "../Pagination"; // کامپوننت صفحه‌بندی
import ProductTableRow from "./ProductTableRow"; // کامپوننت ردیف جدول محصول
import TableHeader from "../TableHeader"; // کامپوننت هدر جدول

const ITEMS_PER_PAGE = 4; // تعداد آیتم‌ها در هر صفحه

const ProductsTable = () => {
  // تعریف state برای لیست محصولات
  const [products, setProducts] = useState<Product[]>([]);
  // state برای نگهداری ردیف در حال ویرایش (id یا null)
  const [editingRow, setEditingRow] = useState<number | string | null>(null);
  // گرفتن پارامترهای جستجو از URL
  const searchParams = useSearchParams();
  // گرفتن router برای تغییر مسیر
  const router = useRouter();
  // گرفتن مسیر فعلی
  const pathname = usePathname();

  // state برای عبارت جستجو، مقدار اولیه از پارامتر URL
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  // state برای دسته‌بندی انتخاب شده، مقدار اولیه از پارامتر URL
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");
  // state برای شماره صفحه فعلی
  const [currentPage, setCurrentPage] = useState<number>(1);

  // گرفتن لیست محصولات از فایل json هنگام اولین رندر
  useEffect(() => {
    fetch("/data/data.json") // درخواست گرفتن داده‌ها
      .then((res) => res.json()) // تبدیل به json
      .then((data) => setProducts(data.products)); // ذخیره محصولات در state
  }, []); // فقط یک بار اجرا می‌شود

  // تابع به‌روزرسانی پارامتر جستجو در URL
  const updateSearchParam = (term: string) => {
    const params = new URLSearchParams(searchParams.toString()); // کپی پارامترها
    if (term) {
      params.set("search", term); // اگر مقدار دارد، ست کن
    } else {
      params.delete("search"); // اگر خالی است، حذف کن
    }
    router.push(`${pathname}?${params.toString()}`); // تغییر URL
  };

  // تابع به‌روزرسانی پارامتر دسته‌بندی در URL
  const updateCategoryParam = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString()); // کپی پارامترها
    if (cat) {
      params.set("category", cat); // اگر مقدار دارد، ست کن
    } else {
      params.delete("category"); // اگر خالی است، حذف کن
    }
    router.push(`${pathname}?${params.toString()}`); // تغییر URL
  };

  // تابع شروع ویرایش یک ردیف خاص
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

  // رندر کامپوننت
  return (
    <motion.div
      className="bg-[var(--component-bg)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[var(--border)] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* هدر جدول */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--text-secondary)] text-center md:text-right">
          لیست محصولات
        </h2>
      </div>

      {/* بخش جستجو و فیلتر */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ProductSearchInput
          value={searchTerm} // مقدار جستجو
          onChange={(val) => {
            setSearchTerm(val); // تغییر مقدار جستجو
            updateSearchParam(val); // به‌روزرسانی پارامتر URL
            setCurrentPage(1); // بازگشت به صفحه اول
          }}
        />
        <ProductCategoryFilter
          value={category} // مقدار دسته‌بندی
          onChange={(val) => {
            setCategory(val); // تغییر مقدار دسته‌بندی
            updateCategoryParam(val); // به‌روزرسانی پارامتر URL
            setCurrentPage(1); // بازگشت به صفحه اول
          }}
        />
      </div>

      {/* جدول محصولات */}
      <div className=" mt-4 overflow-clip">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <TableHeader />
          </thead>
          <tbody className="divide-y divide-gray-500">
            {/* نمایش ردیف‌های محصولات */}
            {paginatedProducts.map((product) => (
              <ProductTableRow
                key={product.id} // کلید یکتا
                product={product} // اطلاعات محصول
                editingRow={editingRow} // ردیف در حال ویرایش
                handleEditClick={handleEditClick} // تابع شروع ویرایش
                handleSaveClick={handleSaveClick} // تابع پایان ویرایش
                handleChange={handleChange} // تابع تغییر مقدار
                handleDeleteProduct={handleDeleteProduct} // تابع حذف محصول
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* صفحه‌بندی */}
      <Pagination
        currentPage={currentPage} // شماره صفحه فعلی
        totalPages={totalPages} // تعداد کل صفحات
        onPageChange={handlePageChange} // تابع تغییر صفحه
      />
    </motion.div>
  );
};

export default ProductsTable; // خروجی کامپوننت
