"use client";

import StateCard from "@/components/StateCard";
import {
  ChartBarStacked,
  DollarSign,
  ShoppingBag,
  SquareActivity,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import ProductsTable from "@/components/products/ProductsTable";

function ProductsPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StateCard name="کل محصولات" icon={ShoppingBag} value={"۴,۳۵۲"} />
          <StateCard name="کل موجودی" icon={SquareActivity} value={"۱۸,۴۵۰"} />
          <StateCard name="کل فروخته شده" icon={DollarSign} value={"۱۲,۷۸۰"} />
          <StateCard
            name="کل دسته‌بندی‌ها"
            icon={ChartBarStacked}
            value={"۸"}
          />
        </motion.div>
        <ProductsTable/>
      </main>
    </div>
  );
}

export default ProductsPage;
