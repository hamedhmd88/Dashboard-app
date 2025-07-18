/**
 * این کامپوننت هدر جدول مشتریان را تعریف می‌کند.
 * هدرها شامل نام، ایمیل، شماره تلفن، کشور و عملیات هستند.
 */
import React from "react";

// آرایه هدرهای جدول
const headers = [
  "نام",
  "ایمیل",
  "شماره تلفن",
  "کشور",
  "عملیات",
];

// کامپوننت اصلی هدر جدول
const ClientTableHeader = () => (
  <tr>
    {headers.map((header) => (
      // ایجاد سلول هدر برای هر عنوان
      <th
        key={header}
        className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-[var(--text-secondary)] hidden md:table-cell"
      >
        {header}
      </th>
    ))}
  </tr>
);

// اکسپورت کامپوننت
export default ClientTableHeader;

