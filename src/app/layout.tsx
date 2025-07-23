import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/components/SidebarContext";
import { UserProvider } from "@/components/UserContext";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Dashboard by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased persian-digits`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <UserProvider>
            <SidebarProvider>
              <ClientLayout>{children}</ClientLayout>
            </SidebarProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
