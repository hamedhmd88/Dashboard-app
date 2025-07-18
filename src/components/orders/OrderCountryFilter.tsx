interface OrderCountryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const OrderCountryFilter = ({
  value,
  onChange,
}: OrderCountryFilterProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[var(--component-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      <option value="">همه کشورها</option>
      <option value="ایران">ایران</option>
      <option value="امارات">امارات</option>
    </select>
  );
};

export default OrderCountryFilter;

