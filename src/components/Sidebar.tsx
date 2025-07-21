// این کامپوننت سمت کلاینت اجرا می‌شود
"use client";
// ایمپورت آیکون‌های مورد نیاز از کتابخانه lucide-react
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
// گرفتن مسیر فعلی صفحه با استفاده از هوک usePathname از next/navigation
import { usePathname } from "next/navigation";
// ایمپورت آیکون X برای بستن سایدبار
import { X } from "lucide-react";
// ایمپورت ری‌اکت و هوک‌های useEffect و useState برای مدیریت وضعیت کامپوننت
import React, { useEffect, useState } from "react";
// گرفتن context سایدبار برای مدیریت باز و بسته بودن آن
import { useSidebar } from "./SidebarContext";
// تعریف نوع داده آیتم‌های سایدبار
import { SidebarItem } from "../../public/data/dataTypes";
// گرفتن context تم برای تغییر تم روشن/تاریک
import { useTheme } from "@/components/ThemeProvider";
// ایمپورت Link برای لینک‌دهی بین صفحات
import Link from "next/link";

// تعریف یک شیء برای نگهداری آیکون‌ها بر اساس نام آن‌ها
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
  // گرفتن وضعیت تم و تابع تغییر تم از context
  const { theme, toggleTheme } = useTheme();
  // گرفتن وضعیت باز/بسته بودن سایدبار در موبایل و دسکتاپ و توابع تغییر آن‌ها
  const { isMobileOpen, toggleMobile, isDesktopOpen, toggleDesktop } =
    useSidebar();
  // تعریف state برای نگهداری آیتم‌های سایدبار
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  // گرفتن مسیر فعلی صفحه
  const pathname = usePathname();

  // هر بار که مسیر صفحه تغییر کند، اگر سایدبار موبایل باز باشد، آن را می‌بندد
  useEffect(() => {
    if (isMobileOpen) {
      toggleMobile();
    }
  }, [pathname]);

  // هنگام اولین رندر، آیتم‌های سایدبار را از فایل json می‌خواند
  useEffect(() => {
    fetch("data/data.json")
      .then((res) => res.json())
      .then((data) => setSidebarItems(data.sidebarItems));
  }, []);

  return (
    <>
      {/* اگر سایدبار موبایل باز باشد، یک لایه مشکی نیمه شفاف برای بک‌گراند نمایش می‌دهد */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleMobile}
        ></div>
      )}
      {/* کانتینر اصلی سایدبار */}
      <div
        className={`fixed md:relative top-0 right-0 h-full transition-all duration-300 ease-in-out flex-shrink-0 z-50 bg-[var(--component-bg)] backdrop-blur-md p-4 flex flex-col border-l border-[var(--border)] overflow-y-auto ${
          isMobileOpen || isDesktopOpen
            ? "w-64 translate-x-0"
            : "w-0 translate-x-full md:w-20 md:translate-x-0"
        } ${
          isDesktopOpen ? "md:w-64" : "md:w-20"
        }`}
      >
        {/* دکمه باز/بسته کردن سایدبار در دسکتاپ */}
        <button
          onClick={toggleDesktop}
          className="hidden md:block p-2 rounded-full hover:bg-[var(--component-hover)] transition-all max-w-fit cursor-pointer"
        >
          <Menu size={24} />
        </button>
        {/* دکمه باز/بسته کردن سایدبار در موبایل */}
        <button
          onClick={toggleMobile}
          className="md:hidden p-2 rounded-full hover:bg-[var(--component-hover)] transition-all max-w-fit cursor-pointer absolute top-4 left-4"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* لیست آیتم‌های سایدبار */}
        <nav className="mt-8">
          {sidebarItems.map((item) => {
            // گرفتن کامپوننت آیکون بر اساس نام آیکون در داده
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
                  {/* نمایش آیکون آیتم */}
                  {IconComponent && (
                    <IconComponent size={20} style={{ minWidth: "20px" }} />
                  )}
                  {/* اگر سایدبار باز باشد، نام آیتم را نمایش می‌دهد */}
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
                    // اگر سایدبار بسته باشد، نام آیتم را به صورت تولتیپ کنار آیکون نمایش می‌دهد
                    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[var(--component-hover)] text-[var(--foreground)] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                      {name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        {/* دکمه تغییر تم (روشن/تاریک) */}
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
