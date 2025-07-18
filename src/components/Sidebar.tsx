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
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSidebar } from "./SidebarContext";
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
  const { isMobileOpen, toggleMobile, isDesktopOpen, toggleDesktop } =
    useSidebar();
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (isMobileOpen) {
      toggleMobile();
    }
  }, [pathname]);

  useEffect(() => {
    fetch("data/data.json")
      .then((res) => res.json())
      .then((data) => setSidebarItems(data.sidebarItems));
  }, []);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleMobile}
        ></div>
      )}
      <div
        className={`fixed md:relative top-0 right-0 h-full transition-all duration-300 ease-in-out flex-shrink-0 z-50 bg-[var(--component-bg)] backdrop-blur-md p-4 flex flex-col border-l border-[var(--border)] overflow-y-auto ${
          isMobileOpen || isDesktopOpen
            ? "w-64 translate-x-0"
            : "w-0 translate-x-full md:w-20 md:translate-x-0"
        } ${
          isDesktopOpen ? "md:w-64" : "md:w-20"
        } overflow-hidden md:overflow-visible`}
      >
        <button
          onClick={toggleDesktop}
          className="hidden md:block p-2 rounded-full hover:bg-[var(--component-hover)] transition-all max-w-fit cursor-pointer"
        >
          <Menu size={24} />
        </button>
        <button
          onClick={toggleMobile}
          className="md:hidden p-2 rounded-full hover:bg-[var(--component-hover)] transition-all max-w-fit cursor-pointer absolute top-4 left-4"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="mt-8">
          {sidebarItems.map((item) => {
            const IconComponent = ICON[item.icon as keyof typeof ICON];
            const name = item.name ?? "";
            const href = item.href ?? "#";
            return (
              <Link
                key={name}
                href={href}
                onClick={() => isMobileOpen && toggleMobile()}
              >
                <div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[var(--component-hover)] transition-all mb-2 group relative cursor-pointer ${
                    pathname === item.href ? "bg-[var(--component-hover)]" : ""
                  }`}
                >
                  {IconComponent && (
                    <IconComponent size={20} style={{ minWidth: "20px" }} />
                  )}
                  {isMobileOpen || isDesktopOpen ? (
                    <span
                      className={`mr-4 lg:font-medium lg:text-lg whitespace-nowrap transition-all duration-500 ease-in-out \
                        ${
                          isMobileOpen || isDesktopOpen
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
        <div className=" flex justify-center items-center mx-auto">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--component-hover)] transition-all max-w-fit cursor-pointer"
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
