"use client";
import { motion } from "framer-motion";
import { Ban, CheckCircle, Clock, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { OrderStat } from "../../../public/data/dataTypes";
import StatCard from "../../components/StateCard";
import OrdersTable from "../../components/orders/OrdersTable";

const iconMap = {
  ShoppingBag,
  CheckCircle,
  Clock,
  Ban,
};

function OrdersPage() {
  const [orderStats, setOrderStats] = useState<OrderStat[]>([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => setOrderStats(data.orderStats));
  }, []);

  return (
    <div className="flex-1 relative overflow-auto z-10">
      <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {orderStats.map(({ name, value, icon }) => {
            const IconComponent = iconMap[icon as keyof typeof iconMap];
            return (
              <StatCard
                key={name}
                name={name || ""}
                icon={IconComponent}
                value={value || ""}
              />
            );
          })}
        </motion.div>
        <OrdersTable />
      </div>
    </div>
  );
}

export default OrdersPage;
