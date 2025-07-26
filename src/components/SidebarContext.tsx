"use client";

// ایمپورت کردن توابع و نوع‌های مورد نیاز از ری‌اکت
import {
  createContext, // برای ساخت context جدید
  useContext,   // برای استفاده از context در کامپوننت‌ها
  useState,     // برای مدیریت state محلی
  useEffect,    // برای اجرای کد هنگام mount و تغییرات
  ReactNode,    // نوعی برای مشخص کردن نوع children
} from "react";

// تعریف نوع (Type) برای context سایدبار
// این نوع مشخص می‌کند که context چه مقادیری را نگه می‌دارد
// isMobileOpen: آیا سایدبار در حالت موبایل باز است یا نه
// toggleMobile: تابعی برای باز و بسته کردن سایدبار موبایل
// isDesktopOpen: آیا سایدبار در حالت دسکتاپ باز است یا نه
// toggleDesktop: تابعی برای باز و بسته کردن سایدبار دسکتاپ
//
type SidebarContextType = {
  isMobileOpen: boolean;
  toggleMobile: () => void;
  isDesktopOpen: boolean;
  toggleDesktop: () => void;
};

// ساخت context با مقدار اولیه undefined
// این context بعداً توسط provider مقداردهی می‌شود
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// تعریف provider برای context سایدبار
// این کامپوننت باید دور بخش‌هایی از اپلیکیشن که نیاز به دسترسی به وضعیت سایدبار دارند قرار بگیرد
export function SidebarProvider({ children }: { children: ReactNode }) {
  // تعریف state برای باز یا بسته بودن سایدبار موبایل
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // تعریف state برای باز یا بسته بودن سایدبار دسکتاپ
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);

  // تابعی برای تغییر وضعیت باز/بسته بودن سایدبار موبایل
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  // تابعی برای تغییر وضعیت باز/بسته بودن سایدبار دسکتاپ
  const toggleDesktop = () => setIsDesktopOpen(!isDesktopOpen);

  // استفاده از useEffect برای مدیریت وضعیت سایدبار هنگام تغییر سایز صفحه
  useEffect(() => {
    // این تابع بررسی می‌کند که آیا صفحه در حالت دسکتاپ است یا نه
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768; // اگر عرض صفحه بیشتر یا مساوی ۷۶۸ پیکسل باشد، دسکتاپ است
      setIsDesktopOpen(isDesktop); // اگر دسکتاپ بود، سایدبار دسکتاپ را باز می‌کند
      setIsMobileOpen(false);      // همیشه سایدبار موبایل را می‌بندد
    };

    handleResize(); // هنگام mount شدن کامپوننت، یک بار اجرا می‌شود
    window.addEventListener("resize", handleResize); // هنگام تغییر سایز صفحه، دوباره اجرا می‌شود
    return () => window.removeEventListener("resize", handleResize); // هنگام unmount شدن، event listener پاک می‌شود
  }, []);

  // بازگرداندن provider و ارسال مقادیر context به فرزندان
  return (
    <SidebarContext.Provider
      value={{ isMobileOpen, toggleMobile, isDesktopOpen, toggleDesktop }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// هوک سفارشی برای استفاده راحت‌تر از context سایدبار در کامپوننت‌ها
export function useSidebar() {
  const context = useContext(SidebarContext);
  // اگر context مقداردهی نشده باشد (خارج از provider استفاده شود)، خطا می‌دهد
  if (undefined === context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
