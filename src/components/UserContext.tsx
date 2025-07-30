"use client"; 
// این دستور برای فعال کردن ویژگی‌های سمت کلاینت در Next.js 13+ استفاده می‌شود. (مخصوص فایل‌هایی که از useState/useEffect و ... استفاده می‌کنند)

// -----------------------------
// ابزارهای مورد نیاز را از React ایمپورت می‌کنیم:
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// تعریف نوع (Type) کاربر:
// نوع "User" می‌تونه یک شیء شامل fullName باشه، یا null باشه (برای وقتی کاربری لاگین نکرده)
type User = {
  fullName: string;
} | null;

// 🔶 تعریف context کاربر:

// ⬇ این قسمت «تایپ جنریک (Generic Type)» برای createContext هست
// یعنی به createContext می‌گیم که context قراره یک شیء باشه شامل:
//    - user: از نوع User (که می‌تونه null یا { fullName: string } باشه)
//    - setUser: تابعی که یک User دریافت می‌کنه و چیزی برنمی‌گردونه (void)
const UserContext = createContext<{
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}>(

  // ⬇ این قسمت مقدار اولیه (🟡 Default Value) هست که به createContext داده شده
  {
    user: null,              // در حالت اولیه، هیچ کاربری لاگین نیست
    setUser: () => {},       // تابع خالی؛ برای جلوگیری از خطا در زمان استفاده خارج از Provider
    logout: () => {},        // تابع خالی؛ برای جلوگیری از خطا در زمان استفاده خارج از Provider
  }
);

// 🔹 حالا یک Provider تعریف می‌کنیم که context را برای اجزای داخلی‌اش فراهم می‌کند
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // این useEffect فقط یک بار در زمان mount کامپوننت اجرا می‌شود
  // و اطلاعات کاربر را از localStorage بارگذاری می‌کند
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // این useEffect هر وقت مقدار user تغییر کند اجرا می‌شود
  // و اطلاعات کاربر را در localStorage ذخیره می‌کند یا حذف می‌کند
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
   const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  return (
    // اینجا مقدار context را به Provider می‌دهیم تا بقیه اجزا بتوانند به آن دسترسی داشته باشند
    <UserContext.Provider value={{ user, setUser,  logout }}>
      {children}
    </UserContext.Provider>
  );
}

// 🔸 این تابع سفارشی (Custom Hook) برای دسترسی راحت‌تر به context استفاده می‌شود
export const useUser = () => useContext(UserContext);

// حالا هر کامپوننتی که داخل <UserProvider> قرار گرفته باشه، می‌تونه از useUser() استفاده کنه
// و به user و setUser دسترسی داشته باشه
