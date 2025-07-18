interface OrderStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const OrderStatusFilter = ({
  value,
  onChange,
}: OrderStatusFilterProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[var(--component-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      <option value="">همه وضعیت‌ها</option>
      <option value="در انتظار">در انتظار</option>
      <option value="لغو شده">لغو شده</option>
      <option value="تحویل داده شده">تحویل داده شده</option>
    </select>
  );
};

export default OrderStatusFilter;

