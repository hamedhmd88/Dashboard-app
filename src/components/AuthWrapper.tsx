"use client";

import { useUser } from "./UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname !== "/register") {
      router.push("/register");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}