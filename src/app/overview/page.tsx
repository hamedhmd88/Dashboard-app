"use client";

import StateCard from "@/components/StateCard";
import { DollarSign, ShoppingBag, SquareActivity, Users } from "lucide-react";
import { motion } from "framer-motion";
import SalesOverviewChart from "@/components/SalesOverviewChart";
import CategoryChart from "@/components/CategoryChart";
import OrderChart from "@/components/OrderChart";
import ProductChart from "@/components/ProductChart";
function OverviewPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StateCard name="فروش کل" icon={DollarSign} value="۱۸۲,۴۵۰$" />
          <StateCard name="کل مشتریان" icon={Users} value="۱,۴۳۷" />
          <StateCard name="کل محصولات" icon={ShoppingBag} value="۶۷۴" />
          <StateCard name="موجودی" icon={SquareActivity} value="۱۲,۸۴۵" />
        </motion.div>
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SalesOverviewChart/>
            <CategoryChart/>
            <OrderChart/>
            <ProductChart/>
        </div>
      </main>
    </div>
  );
}

export default OverviewPage;
