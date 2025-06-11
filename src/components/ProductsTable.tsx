"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "../../public/data/dataTypes";
import Image from "next/image";
import ProductSearchInput from "./ProductSearchInput";
import ProductCategoryFilter from "./ProductCategoryFilter";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 4;

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

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

      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4"
        dir="rtl"
      >
        <ProductSearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
        />
        <ProductCategoryFilter
          value={category}
          onChange={(val) => {
            setCategory(val);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className=" mt-4 overflow-clip">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {[
                "نام",
                "شناسه محصول",
                "دسته‌بندی",
                "قیمت",
                "موجودی",
                "فروش",
                "عملیات",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-gray-400 hidden md:table-cell"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {paginatedProducts.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0 "
              >
                <td className="md:hidden px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image
                        src={product.image || "/fallback.png"}
                        alt={product.name || "محصول"}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full"
                      />
                      <div className="mr-3">
                        <div className="text-base font-medium text-gray-300 text-right">
                          {product.name}
                        </div>
                        <div className="text-base text-gray-300 text-right">
                          شناسه: {product.id}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row-reverse space-x-reverse space-x-1 -mt-1 -mr-1">
                      <button className="text-indigo-500 hover:text-indigo-300">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-base text-gray-300 text-right">
                    <div>دسته‌بندی: {product.category}</div>
                    {[
                      { label: "قیمت", value: product.price },
                      { label: "موجودی", value: product.stock },
                      { label: "فروش", value: product.sales },
                    ].map((field) => (
                      <div key={field.label} className=" text-base">
                        <span>{field.label}: </span>
                        <span>{field.value}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base font-medium text-gray-300">
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
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right">
                  {product.id}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right">
                  {product.category}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right">
                  {product.price}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right">
                  {product.stock}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right">
                  {product.sales}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex space-x-4 -mx-2">
                    <button className="text-indigo-500 hover:text-indigo-300 mr-1 cursor-pointer">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-300 cursor-pointer">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
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
