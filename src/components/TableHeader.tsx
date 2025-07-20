import React from "react";

const headers = [
  "نام",
  "شناسه محصول",
  "دسته‌بندی",
  "قیمت",
  "موجودی",
  "فروش",
  "عملیات",
];

const TableHeader = () => (
  <tr>
    {headers.map((header) => (
      <th
        key={header}
        className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell"
      >
        {header}
      </th>
    ))}
  </tr>
);

export default TableHeader;
