"use client";
import {
  Bell,
  DollarSign,
  House,
  Info,
  Mail,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SidebarItem } from "../../public/data/dataTypes";
import Link from "next/link";

const ICON = {
  House,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Mail,
  Users,
  Bell,
  Info,
};
function Sidebar() {
  const [isSidebarOpen, setIssidebarOpen] = useState<boolean>(false);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetch("data/data.json")
      .then((res) => res.json())
      .then((data) => setSidebarItems(data.sidebarItems));
  }, []);

  return (
    <div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-full bg-[#0A0A0A] backdrop-blur-md p-4 flex flex-col border-l border-[#2f2f2f]">
        <button
          onClick={() => setIssidebarOpen(!isSidebarOpen)}
          className=" p-2 rounded-full hover:bg-[#1F1F1F] transition-all max-w-fit cursor-pointer"
        >
          <Menu size={24} />
        </button>

        <nav className="mt-8 flex-grow">
          {sidebarItems.map((item) => {
            const IconComponent = ICON[item.icon as keyof typeof ICON];
            const name = item.name ?? "";
            const href = item.href ?? "#";
            return (
              <Link key={name} href={href}>
                <div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#1F1F1F] transition-all mb-2 ${
                    pathname === item.href ? "bg-[#1F1F1F]" : ""
                  }`}
                >
                  {IconComponent && (
                    <IconComponent size={20} style={{ minWidth: "20px" }} />
                  )}
                  {isSidebarOpen && (
                    <span
                      className={`mr-4 lg:font-bold lg:text-lg whitespace-nowrap transition-all duration-500 ease-in-out \
                        ${
                          isSidebarOpen
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4 pointer-events-none"
                        }`}
                    >
                      {name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
