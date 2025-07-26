"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/components/UserContext";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";

function Register() {
  const { setUser } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: "onTouched" });
  const router = useRouter();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: { name: string; lastName: string }) => {
    setLoading(true);
    setTimeout(() => {
      setUser({ fullName: `${data.name} ${data.lastName}` });
      setLoading(false);
      router.push("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden text-gray-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="p-8 rounded-xl shadow-2xl w-full max-w-md bg-gray-800/40 backdrop-blur-xl border border-gray-600/30 relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center">ثبت نام</h2>
        <form onSubmit={handleSubmit((data: any) => onSubmit(data as { name: string; lastName: string }))} className="space-y-4">
          <input
            type="text"
            placeholder="نام"
            {...register("name", { required: "پر کردن این فیلد اجباری است" })}
            className={`w-full p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${errors.name ? 'border-red-500/50' : ''}`}
          />
          {errors.name && <div className="text-red-500 text-sm ">{errors.name.message?.toString()}</div>}

          <input
            type="text"
            placeholder="نام خانوادگی"
            {...register("lastName", { required: "پر کردن این فیلد اجباری است" })}
            className={`w-full p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${errors.lastName ? 'border-red-500/50' : ''}`}
          />
          {errors.lastName && <div className="text-red-500 text-sm ">{errors.lastName.message?.toString()}</div>}

          <input
            type="email"
            placeholder="ایمیل"
            {...register("email", {
              required: "پر کردن این فیلد اجباری است",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "ایمیل معتبر نیست"
              }
            })}
            className={`w-full p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${errors.email ? 'border-red-500/50' : ''}`}
          />
          {errors.email && <div className="text-red-500 text-sm ">{errors.email.message?.toString()}</div>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="پسورد"
              {...register("password", {
                required: "پر کردن این فیلد اجباری است",
                minLength: {
                  value: 4,
                  message: "پسورد باید حداقل ۴ کاراکتر باشد"
                }
              })}
              className={`w-full p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${errors.password ? 'border-red-500/50' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.password && <div className="text-red-500 text-sm ">{errors.password.message?.toString()}</div>}

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="تایید پسورد"
              {...register("confirmPassword", {
                required: "پر کردن این فیلد اجباری است",
                validate: (value) => value === watch("password") || "پسوردها یکی نیستند"
              })}
              className={`w-full p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="text-red-500 text-sm ">{errors.confirmPassword.message?.toString()}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg bg-blue-500/20 backdrop-blur-md text-white font-semibold hover:bg-blue-600/30 hover:backdrop-blur-lg transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer group`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                ثبت نام
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;