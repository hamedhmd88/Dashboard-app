"use client";

import StateCard from "@/components/StateCard";
import {
  ChartBarStacked,
  Globe,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import ClientsTable from "@/components/clients";

function UsersPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StateCard name="کل کاربران" icon={Users} value={"۵,۲۳۰"} />
          <StateCard name="کل کشورها" icon={Globe} value={"۱۵"} />
          <StateCard name="کل ایمیل‌ها" icon={Mail} value={"۴,۸۰۰"} />
          <StateCard name="کل شماره تلفن‌ها" icon={Phone} value={"۴,۵۰۰"} />
        </motion.div>
        <ClientsTable/>
      </main>
    </div>
  );
}

export default UsersPage;