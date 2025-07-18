import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertCircle size={64} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-4">صفحه مورد نظر یافت نشد</h1>
      <Link href="/">
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
          برای بازگشت به صفحه اصلی کلیک کنید
        </button>
      </Link>
    </div>
  );
}