interface ProductCategoryFilterProps {
    value: string;
    onChange: (value: string) => void;
  }
  
  const ProductCategoryFilter = ({ value, onChange }: ProductCategoryFilterProps) => {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0A0A0A] text-white border border-[#1f1f1f] rounded-lg px-4 py-2 text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="">همه محصولات</option>
        <option value="ورزشی">ورزشی</option>
        <option value="خانه">خانه</option>
      </select>
    );
  };
  
  export default ProductCategoryFilter;
  