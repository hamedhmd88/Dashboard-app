"use client";

import { useUser } from "./UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname !== "/register") {
      router.replace("/register");
    } else if (user && pathname === "/register") {
      router.replace("/");
    }
  }, [user, pathname, router]);

  if (pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <div className="relative flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-auto md:ml-0">
        <div className="max-w-7xl mx-auto w-full">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}