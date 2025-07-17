// تعریف تایپ ورودی‌های کامپوننت Pagination
interface PaginationProps {
  currentPage: number; // شماره صفحه فعلی
  totalPages: number; // تعداد کل صفحات
  onPageChange: (page: number) => void; // تابعی که هنگام تغییر صفحه فراخوانی می‌شود
}

// تعریف کامپوننت Pagination
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // اگر فقط یک صفحه یا کمتر داشته باشیم، هیچ چیزی نمایش داده نشود
  if (totalPages <= 1) return null;

  return (
    // کانتینر کلی دکمه‌ها (قبل، شماره صفحات، بعد) - راست‌به‌چپ با فاصله بین آیتم‌ها
    <div className="flex justify-center items-center gap-2 rtl:space-x-reverse mt-6 text-sm">
      {/* دکمه «قبل» برای رفتن به صفحه قبلی */}
      <button
        onClick={() => onPageChange(currentPage - 1)} // با کلیک، صفحه یکی کم می‌شود
        disabled={currentPage === 1} // اگر صفحه اول بود، دکمه غیرفعال شود
        className={`px-3 py-1 rounded-md border ${
          currentPage === 1
            ? "text-gray-500 border-gray-700 cursor-not-allowed" // ظاهر دکمه غیرفعال
            : "text-white border-gray-600 hover:bg-[#1F1F1F] cursor-pointer" // ظاهر دکمه فعال
        }`}
      >
        قبل
      </button>

      {/* دکمه‌های شماره صفحات - فقط در دسکتاپ نمایش داده می‌شوند */}
      <div className="hidden md:flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)} // کلیک روی شماره صفحه
            className={`px-3 py-1 rounded-md border ${
              currentPage === page
                ? "bg-white text-black font-semibold" // صفحه فعال با ظاهر متفاوت
                : "border-gray-600 text-gray-300 hover:bg-[#1F1F1F] cursor-pointer" // صفحات دیگر
            }`}
          >
            {page} {/* شماره صفحه */}
          </button>
        ))}
      </div>

      {/* متن نمایش صفحه فعلی فقط در موبایل */}
      <div className="md:hidden text-gray-300 font-medium px-2">
        صفحه {currentPage} از {totalPages}
      </div>

      {/* دکمه «بعد» برای رفتن به صفحه بعدی */}
      <button
        onClick={() => onPageChange(currentPage + 1)} // با کلیک، صفحه یکی زیاد می‌شود
        disabled={currentPage === totalPages} // اگر در آخرین صفحه باشیم، غیرفعال شود
        className={`px-3 py-1 rounded-md border ${
          currentPage === totalPages
            ? "text-gray-500 border-gray-700 cursor-not-allowed" // ظاهر دکمه غیرفعال
            : "text-white border-gray-600 hover:bg-[#1F1F1F] cursor-pointer" // ظاهر دکمه فعال
        }`}
      >
        بعد
      </button>
    </div>
  );
};

export default Pagination; // خروجی گرفتن از کامپوننت
