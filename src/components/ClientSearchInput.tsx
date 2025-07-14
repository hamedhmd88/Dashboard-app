/**
 * این کامپوننت یک ورودی جستجو برای مشتریان فراهم می‌کند.
 * از آیکون جستجو استفاده می‌کند و مقدار ورودی را مدیریت می‌کند.
 */
import { Search } from "lucide-react";

// اینترفیس پراپس کامپوننت]
 interface ClientSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

// کامپوننت اصلی ورودی جستجو
const ClientSearchInput = ({ value, onChange }: ClientSearchInputProps) => {
  return (
    <div className="relative w-full md:w-auto">
      {/* // فیلد ورودی با پلاس‌هولدر و استایلینگ */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="سرچ مشتری ..."
        className="bg-[#0A0A0A] text-white border border-[#1f1f1f] placeholder-gray-400 rounded-lg pr-10 pl-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm"
      />
      {/* // آیکون جستجو در سمت راست ورودی */}
      <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
    </div>
  );
};

// اکسپورت کامپوننت
export default ClientSearchInput;