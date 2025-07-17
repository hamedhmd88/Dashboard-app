import Image from "next/image";
import IR from "../../public/images/IR.png";
import { Bell } from "lucide-react";
import admin from "../../public/images/admin.jpg";
function Header() {
  return (
    <>
      <header className=" bg-[#0A0A0A] shadow-lg border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg">
        <div className=" max-w-7xl mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
          <h1 className=" text-lg sm:text-xl lg:text-2xl font-semibold text-gray-300">
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
              <Bell className=" w-5 sm:w6 h-5 text-gray-300 cursor-pointer hover:text-white transition-all duration-300" />
            </div>
            <div className=" flex items-center space-x-2 sm:space-x-3">
              <Image
                src={admin}
                alt="admin"
                width={35}
                height={35}
                className=" rounded-full shadow-md cursor-pointer text-gray-600"
              />
              <span className=" hidden sm:block text-gray-300 text-sm">
                محمد حسین حسینی
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
