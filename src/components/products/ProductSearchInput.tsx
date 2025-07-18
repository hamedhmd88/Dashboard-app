import { Search } from "lucide-react";

interface ProductSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ProductSearchInput = ({ value, onChange }: ProductSearchInputProps) => {
  return (
    <div className="relative w-full md:w-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="سرچ محصول ..."
        className="bg-[var(--component-bg)] text-[var(--foreground)] border border-[var(--border)] placeholder-[var(--text-secondary)] rounded-lg pr-10 pl-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm"
      />
      <Search className="absolute right-3 top-2.5 text-[var(--text-secondary)]" size={18} />
    </div>
  );
};

export default ProductSearchInput;


