import React from "react";

const headers = [
  "نام",
  "ایمیل",
  "شماره تلفن",
  "کشور",
  "عملیات",
];

const ClientTableHeader = () => (
  <tr>
    {headers.map((header) => (
      <th
        key={header}
        className="px-3 md:px-6 py-2 md:py-3 text-right text-md font-medium text-gray-400 hidden md:table-cell"
      >
        {header}
      </th>
    ))}
  </tr>
);

export default ClientTableHeader;