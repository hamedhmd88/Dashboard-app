import React from "react";
import Image from "next/image";
import { Edit, Save, Trash2 } from "lucide-react";
import { Client } from "../../public/data/dataTypes";
import { motion } from "framer-motion";

interface ClientsTableRowProps {
  client: Client;
  editingRow: number | null;
  handleEditClick: (id: number) => void;
  handleSaveClick: () => void;
  handleChange: (
    id: number,
    field: keyof Client,
    value: string
  ) => void;
  handleDeleteClient: (id: number) => void;
}

const ClientsTableRow = ({
  client,
  editingRow,
  handleEditClick,
  handleSaveClick,
  handleChange,
  handleDeleteClient,
}: ClientsTableRowProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0  ${editingRow === client.id ? "bg-[#2f2f2f] ring-gray-500" : ""}`}
    >
      {/* موبایل */}
      <td className="md:hidden px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={client.image || "/fallback.png"}
              alt={client.name || "مشتری"}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full"
            />
            <div className="mr-3">
              <div className="text-base font-medium text-gray-300 text-right">
                {client.name}
              </div>
              <div className="text-base text-gray-300 text-right">
                ایمیل: {client.email}
              </div>
              <div className="text-base text-gray-300 text-right">
                شماره تماس: {client.phoneNumber}
              </div>
              <div className="text-base text-gray-300 text-right">
                کشور: {client.country}
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse space-x-reverse space-x-1 -mt-1 -mr-1">
            <button
              className="text-indigo-500 hover:text-indigo-300"
              onClick={() =>
                editingRow === client.id
                  ? handleSaveClick()
                  : client.id !== undefined
                  ? handleEditClick(client.id)
                  : undefined
              }
            >
              {editingRow === client.id ? <Save size={16} /> : <Edit size={16} />}
            </button>
            <button
              className="text-red-500 hover:text-red-300"
              onClick={() => {
                if (client.id !== undefined) {
                  handleDeleteClient(client.id);
                }
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </td>
      {/* دسکتاپ */}
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base font-medium text-gray-300">
        <div className="flex items-center justify-start">
          <Image
            src={client.image || "/fallback.png"}
            alt={client.name || "مشتری"}
            width={50}
            height={50}
            className="w-10 h-10 rounded-full"
          />
          <div className="mr-4">{client.name}</div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right">
        {editingRow === client.id ? (
          <input
            type="text"
            className="bg-transparent text-white border border-gray-400 w-32 text-center text-xs mx-1"
            value={client.email}
            onChange={(e) => {
              if (client.id !== undefined) {
                handleChange(client.id, "email", e.target.value);
              }
            }}
          />
        ) : (
          client.email
        )}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right">
        {editingRow === client.id ? (
          <input
            type="text"
            className="bg-transparent text-white border border-gray-400 w-32 text-center text-xs mx-1"
            value={client.phoneNumber}
            onChange={(e) => {
              if (client.id !== undefined) {
                handleChange(client.id, "phoneNumber", e.target.value);
              }
            }}
          />
        ) : (
          client.phoneNumber
        )}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-base text-gray-300 text-right">
        {editingRow === client.id ? (
          <input
            type="text"
            className="bg-transparent text-white border border-gray-400 w-24 text-center text-xs mx-1"
            value={client.country}
            onChange={(e) => {
              if (client.id !== undefined) {
                handleChange(client.id, "country", e.target.value);
              }
            }}
          />
        ) : (
          client.country
        )}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        <div className="flex space-x-4 -mx-2">
          <button
            className="text-indigo-500 hover:text-indigo-300 mr-1 cursor-pointer"
            onClick={() =>
              editingRow === client.id
                ? handleSaveClick()
                : client.id !== undefined
                ? handleEditClick(client.id)
                : undefined
            }
          >
            {editingRow === client.id ? <Save size={18} /> : <Edit size={18} />}
          </button>
          <button
            className="text-red-500 hover:text-red-300 cursor-pointer"
            onClick={() => {
              if (client.id !== undefined) {
                handleDeleteClient(client.id);
              }
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export default ClientsTableRow; 