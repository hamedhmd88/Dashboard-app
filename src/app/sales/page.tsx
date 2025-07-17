"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import StateCard from "@/components/StateCard";
import SalesProfitChart from "@/components/sales/SalesProfitChart";
import YearlySalesDonutChart from "@/components/sales/YearlySalesDonutChart";
import { SaleRecord } from "../../../public/data/dataTypes";

function SalesPage() {
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setSalesRecords(data.salesRecords || []));
  }, []);

  const totalSales = salesRecords.length;
  const totalRevenue = salesRecords.filter(s => s.status === "موفق").reduce((sum, s) => sum + s.amount, 0);
  const totalProfit = salesRecords.reduce((sum, s) => sum + s.profit, 0);
  const totalLoss = salesRecords.filter(s => s.status === "لغو شده").reduce((sum, s) => sum + Math.abs(s.profit), 0);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StateCard name="تعداد فروش‌ها" icon={TrendingUp} value={totalSales.toLocaleString()} />
          <StateCard name="درآمد کل" icon={DollarSign} value={totalRevenue.toLocaleString()} />
          <StateCard name="سود کل" icon={ArrowUpRight} value={totalProfit.toLocaleString()} />
          <StateCard name="ضرر از لغوها" icon={ArrowDownRight} value={totalLoss.toLocaleString()} />
        </motion.div>
        <SalesProfitChart salesRecords={salesRecords} />
        <YearlySalesDonutChart />
      </main>
    </div>
  );
}

export default SalesPage; 