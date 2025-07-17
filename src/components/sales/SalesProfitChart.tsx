import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";
import { motion } from "framer-motion";
import { SaleRecord } from "../../../public/data/dataTypes";

type Props = {
  salesRecords: SaleRecord[];
};

const SalesProfitChart: React.FC<Props> = ({ salesRecords }) => {
  // Group by date and sum profit/loss for each day
  const chartData = Object.values(
    salesRecords.reduce((acc, rec) => {
      if (!acc[rec.date]) {
        acc[rec.date] = { date: rec.date, profit: 0, loss: 0 };
      }
      if (rec.profit >= 0) {
        acc[rec.date].profit += rec.profit;
      } else {
        acc[rec.date].loss += Math.abs(rec.profit);
      }
      return acc;
    }, {} as Record<string, { date: string; profit: number; loss: number }>)
  );

  return (
    <motion.div
      className="bg-[#0A0A0A] shadow-2xl rounded-2xl p-6 border border-[#23272f] mx-2 md:mx-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-base md:text-2xl font-medium mb-4 text-gray-300 text-center md:text-right">
        نمودار سود و ضرر فروش
      </h2>
      <div className="h-72 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12, fill: "#9ca3af" }} width={60} />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4b5563", fontSize: "12px" }}
              itemStyle={{ color: "#e5e7eb" }}
              formatter={(value: number, name: string, props) => {
                // name can be 'سود' or 'ضرر' or dataKey
                if (props && props.dataKey) {
                  if (props.dataKey === "profit") return [value.toLocaleString(), "سود"];
                  if (props.dataKey === "loss") return [value.toLocaleString(), "ضرر"];
                }
                if (name === "profit" || name === "سود") return [value.toLocaleString(), "سود"];
                if (name === "loss" || name === "ضرر") return [value.toLocaleString(), "ضرر"];
                return [value.toLocaleString(), name];
              }}
            />
            <Legend
              content={({ payload }) => (
                <ul className="flex flex-row-reverse gap-6 justify-center mt-4">
                  {payload && payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center">
                      <span className="text-base text-gray-200 font-semibold">
                        {entry.dataKey === "profit" ? "سود" : entry.dataKey === "loss" ? "ضرر" : entry.value}
                      </span>
                      <span
                        className="mr-2 inline-block w-4 h-4 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            />
            <Bar dataKey="profit" fill="#22c55e" name="سود" radius={[8, 8, 0, 0]} />
            <Bar dataKey="loss" fill="#ef4444" name="ضرر" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesProfitChart; 