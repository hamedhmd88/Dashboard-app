"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { Product } from "../../public/data/dataTypes";
import Image from "next/image";

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);
  return (
    <motion.div
      className="bg-[#0A0A0A] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-100 text-center md:text-right">
          لیست محصولات{" "}
        </h2>
      </div>
      <div className="relative w-full md:w-auto">
        <input
          type="text"
          placeholder="سرچ محصول ..."
          className="bg-[#0A0A0A] text-white border  border-[#1f1f1f] placeholder-gray-400 rounded-lg pr-10 pl-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
      </div>
      <div className="overflow-x-auto mt-4" dir="rtl">
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
          <tbody className="divide-y divide-gray-700">
            {products.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0"
              >
                <td className="md:hidden px-3 py-2" dir="rtl">
                  {" "}
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
                        {" "}
                        <div className="text-base font-medium text-gray-100 text-right">
                          {" "}
                          {product.name}
                        </div>
                        <div
                          className="text-base text-gray-400 text-right"
                          dir="ltr"
                        >
                          {" "}
                          شناسه: {product.id}{" "}
                        </div>
                      </div>
                    </div>

                    {/* بخش دکمه‌های عملیات */}
                    {/* در RTL، space-x-1 باید به space-x-reverse و سپس space-x-1 تبدیل شود */}
                    {/* mt-1 و mr-1 نیز باید با توجه به جایگاه دکمه‌ها در RTL بررسی شوند */}
                    <div className="flex flex-row-reverse space-x-reverse space-x-1 -mt-1 -mr-1">
                      {" "}
                      {/* <--- تغییرات برای RTL در flex و space-x */}
                      <button className="text-indigo-500 hover:text-indigo-300">
                        <Edit size={16} /> {/* <--- آیکون Edit */}
                        {/* می‌توانید متن دکمه را نیز اضافه کنید، مثلاً "ویرایش" */}
                      </button>
                      <button className="text-red-500 hover:text-red-300">
                        <Trash2 size={16} /> {/* <--- آیکون Trash2 */}
                        {/* می‌توانید متن دکمه را نیز اضافه کنید، مثلاً "حذف" */}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-base text-gray-300 text-right">
                    <div>
                      دسته‌بندی: {product.category}{" "}
                      {/* <--- ترجمه "Category:" */}
                    </div>
                    {[
                      { label: "قیمت", value: product.price }, // <--- اینجا فرض می‌کنیم product.price خودش عدد فارسی یا رشته فارسی است
                      { label: "موجودی", value: product.stock }, // <--- اینجا فرض می‌کنیم product.stock خودش عدد فارسی یا رشته فارسی است
                      { label: "فروش", value: product.sales }, // <--- اینجا فرض می‌کنیم product.sales خودش عدد فارسی یا رشته فارسی است
                    ].map((field) => (
                      <div key={field.label} className=" text-base">
                        <span className="/* capitalize */">
                          {field.label}:{" "}
                        </span>
                        <span>{field.value}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base font-medium text-gray-100">
                  {" "}
                  <div className="flex items-center justify-start">
                    {" "}
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

                <td
                  className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right"
                  dir="ltr"
                >
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
    </motion.div>
  );
};

export default ProductsTable;
