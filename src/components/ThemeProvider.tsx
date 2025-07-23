"use client"; // نشان‌دهنده این است که این کامپوننت سمت کلاینت اجرا می‌شود.

import { createContext, useContext, useEffect, useState } from "react"; // وارد کردن هوک‌ها و توابع لازم از ری‌اکت برای مدیریت کانتکست و حالت.

// تعریف نوع Theme که می‌تواند "light" یا "dark" باشد.
type Theme = "light" | "dark";

// ایجاد یک کانتکست برای تم، که شامل تم فعلی و تابعی برای تغییر آن است.
const ThemeContext = createContext<
  { theme: Theme; toggleTheme: () => void } | undefined
>(undefined);

// کامپوننت ThemeProvider که تم را مدیریت می‌کند و به فرزندان ارائه می‌دهد.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // حالت تم با مقدار اولیه "light".
  const [theme, setTheme] = useState<Theme>("dark");

  // افکت برای اعمال کلاس "dark" به المنت ریشه بر اساس تم.
  useEffect(() => {
    if (theme === "dark") {
      // اضافه کردن کلاس dark برای تم تاریک.
      document.documentElement.classList.add("dark");
    } else {
      // حذف کلاس dark برای تم روشن.
      document.documentElement.classList.remove("dark");
    }
  }, [theme]); // وابستگی به تم برای اجرای مجدد.

  // تابعی برای تغییر تم بین light و dark.
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // ارائه کانتکست به فرزندان.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// هوک سفارشی برای استفاده از کانتکست تم در کامپوننت‌های دیگر.
export function useTheme() {
  // دریافت کانتکست.
  const context = useContext(ThemeContext);
  // بررسی اینکه آیا درون Provider استفاده شده است.
  if (undefined === context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  // بازگشت مقادیر کانتکست.
  return context;
}
