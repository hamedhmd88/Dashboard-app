interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;
  
    return (
      <div className="flex justify-center items-center gap-2 rtl:space-x-reverse mt-6 text-sm">
        {/* دکمه قبل */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border ${
            currentPage === 1
              ? "text-gray-500 border-gray-700 cursor-not-allowed"
              : "text-white border-gray-600 hover:bg-gray-800"
          }`}
        >
          قبل
        </button>
  
        {/* شماره صفحات در دسکتاپ */}
        <div className="hidden md:flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === page
                  ? "bg-white text-black font-semibold"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
  
        {/* شماره فعلی در موبایل */}
        <div className="md:hidden text-gray-300 font-medium px-2">
          صفحه {currentPage} از {totalPages}
        </div>
  
        {/* دکمه بعد */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border ${
            currentPage === totalPages
              ? "text-gray-500 border-gray-700 cursor-not-allowed"
              : "text-white border-gray-600 hover:bg-gray-800"
          }`}
        >
          بعد
        </button>
      </div>
    );
  };
  
  export default Pagination;
  