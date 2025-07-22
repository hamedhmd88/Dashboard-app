"use client"; 
// این دستور برای فعال کردن ویژگی‌های سمت کلاینت در Next.js 13+ استفاده می‌شود. (مخصوص فایل‌هایی که از useState/useEffect و ... استفاده می‌کنند)

// -----------------------------
// ابزارهای مورد نیاز را از React ایمپورت می‌کنیم:
import { createContext, useContext, useState, ReactNode } from "react";

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
}>(

  // ⬇ این قسمت مقدار اولیه (🟡 Default Value) هست که به createContext داده شده
  {
    user: null,              // در حالت اولیه، هیچ کاربری لاگین نیست
    setUser: () => {},       // تابع خالی؛ برای جلوگیری از خطا در زمان استفاده خارج از Provider
  }
);

// 🔹 حالا یک Provider تعریف می‌کنیم که context را برای اجزای داخلی‌اش فراهم می‌کند
export function UserProvider({ children }: { children: ReactNode }) {
  // state مربوط به کاربر را با useState نگه می‌داریم
  const [user, setUser] = useState<User>(null); // حالت اولیه: null (یعنی هنوز کاربری لاگین نیست)

  return (
    // اینجا مقدار context را به Provider می‌دهیم تا بقیه اجزا بتوانند به آن دسترسی داشته باشند
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 🔸 این تابع سفارشی (Custom Hook) برای دسترسی راحت‌تر به context استفاده می‌شود
export const useUser = () => useContext(UserContext);

// حالا هر کامپوننتی که داخل <UserProvider> قرار گرفته باشه، می‌تونه از useUser() استفاده کنه
// و به user و setUser دسترسی داشته باشه
