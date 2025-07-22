"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/components/UserContext";

function Register() {
  const { setUser } = useUser();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("پسوردها مطابقت ندارند");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ fullName: `${name} ${lastName}` });
      setLoading(false);
      router.push("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-[var(--component-bg)] border border-[var(--border)]">
        <h2 className="text-2xl font-bold mb-6 text-center">ثبت نام</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="نام"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded border bg-[var(--component-bg)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="نام خانوادگی"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 rounded border bg-[var(--component-bg)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded border bg-[var(--component-bg)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="پسورد"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded border bg-[var(--component-bg)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="تایید پسورد"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded border bg-[var(--component-bg)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "ثبت نام"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;