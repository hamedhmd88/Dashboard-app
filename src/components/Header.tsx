"use client";
import Image from "next/image";
import IR from "../../public/images/IR.png";
import { Bell, Menu, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useSidebar } from "./SidebarContext";
import admin from "../../public/images/admin.jpg";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useUser } from "./UserContext";
import { LogOut } from "lucide-react";
function Header() {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "علی احمدی", preview: "سلام، سفارش جدید...", date: "۱۴۰۲/۰۸/۱۰" },
    { sender: "مریم رضایی", preview: "پرداخت انجام شد...", date: "۱۴۰۲/۰۸/۰۹" },
    { sender: "احمد کریمی", preview: "مشکل در سفارش...", date: "۱۴۰۲/۰۸/۰۸" },
    {
      sender: "سارا محمدی",
      preview: "به‌روزرسانی وضعیت...",
      date: "۱۴۰۲/۰۸/۰۷",
    },
    { sender: "رضا علیپور", preview: "سفارش تایید شد...", date: "۱۴۰۲/۰۸/۰۶" },
  ]);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const hasNewMessages = messages.length > 0;

  const deleteMessage = (index: any): any => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const dropdownContent = (
    <div className={`p-4 overflow-y-auto ${isMobile ? "h-full" : ""}`}>
      <h3 className="text-sm font-semibold mb-2">
        پیام‌های جدید ({messages.length})
      </h3>
      {messages.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          هیچ پیامی وجود ندارد
        </p>
      ) : (
        <>
          {(showAll ? messages : messages.slice(0, 2)).map((msg, index) => (
            <div
              key={index}
              className="py-2 border-b last:border-b-0 flex justify-between items-start"
            >
              <div>
                <p className="text-sm font-medium">
                  {msg.sender} - {msg.date}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {msg.preview}
                </p>
              </div>
              <Trash
                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => deleteMessage(index)}
              />
            </div>
          ))}
          <div
            className="mt-2 text-xs text-blue-500 cursor-pointer flex items-center justify-center"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                مشاهده کمتر <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                نمایش بیشتر <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
  return (
    <>
      <header className=" bg-[var(--component-bg)] shadow-lg border-[var(--border)] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg">
        <div className=" max-w-7xl mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
          <button
            className="md:hidden p-2 rounded-full hover:bg-[var(--component-hover)] transition-all max-w-fit cursor-pointer"
            onClick={useSidebar().toggleMobile}
          >
            <Menu size={24} />
          </button>
          <h1 className=" text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--foreground)] ml-auto md:ml-0">
            داشبورد
          </h1>
          <div className=" flex items-center space-x-3 sm:space-x-6">
            <Image
              src={IR}
              alt="country"
              width={25}
              height={18}
              className=" rounded-full shadow-md cursor-pointer"
            />
            <div className=" relative">
              <Bell
                className=" w-5 sm:w-6 h-5 text-[var(--text-secondary)] cursor-pointer hover:text-[var(--foreground)] transition-all duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {messages.length > 0 ? (
                <span className="absolute top-2 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
              ) : (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              {isDropdownOpen &&
                (isMobile ? (
                  <div
                    className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div
                      className={`fixed top-0 left-0 h-full w-4/5 bg-[var(--component-bg)] border-r border-[var(--border)] shadow-lg transition-transform duration-300 transform ${
                        isDropdownOpen ? "translate-x-0" : "-translate-x-full"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {dropdownContent}
                    </div>
                  </div>
                ) : (
                  <div className="absolute -left-3/4 mt-2 w-64 bg-[var(--component-bg)] border border-[var(--border)] rounded-lg shadow-lg z-50">
                    {dropdownContent}
                  </div>
                ))}
            </div>
            {user ? (
              <div className="relative">
                <div
                  className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <Image
                    src={admin}
                    alt="admin"
                    width={35}
                    height={35}
                    className="rounded-full shadow-md"
                  />
                  <span className="hidden sm:block text-[var(--text-secondary)] text-sm">
                    {user.fullName}
                  </span>
                </div>
                {isUserDropdownOpen && (
                  <div className="absolute -left-5 mt-2 w-48 flex items-center justify-center bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-50">
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--component-hover)]"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      خروج از حساب
                      <LogOut className="w-4 h-4 mr-2" />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/register">
                <LogIn className="w-6 h-6 text-[var(--text-secondary)] cursor-pointer hover:text-[var(--foreground)]" />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
