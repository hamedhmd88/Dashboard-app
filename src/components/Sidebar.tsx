"use client";
import {
  Bell,
  DollarSign,
  House,
  Info,
  Mail,
  Menu,
  Moon,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sun,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SidebarItem } from "../../public/data/dataTypes";
import { useTheme } from "@/components/ThemeProvider";
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
  const { theme, toggleTheme } = useTheme();
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
        isSidebarOpen ? "w-64" : "w-22"
      }`}
    >
      <div className="h-full bg-[var(--component-bg)] backdrop-blur-md p-4 flex flex-col border-l border-[var(--border)]">
        <button
          onClick={() => setIssidebarOpen(!isSidebarOpen)}
          className=" p-2 rounded-full hover:bg-[var(--component-hover)] transition-all max-w-fit cursor-pointer"
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
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[var(--component-hover)] transition-all mb-2 group relative ${
                    pathname === item.href ? "bg-[var(--component-hover)]" : ""
                  }`}
                >
                  {IconComponent && (
                    <IconComponent size={20} style={{ minWidth: "20px" }} />
                  )}
                  {isSidebarOpen ? (
                    <span
                      className={`mr-4 lg:font-medium lg:text-lg whitespace-nowrap transition-all duration-500 ease-in-out \
                        ${
                          isSidebarOpen
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4 pointer-events-none"
                        }`}
                    >
                      {name}
                    </span>
                  ) : (
                    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[var(--component-hover)] text-[var(--foreground)] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                      {name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--component-hover)] transition-all max-w-fit cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;


