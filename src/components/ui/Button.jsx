import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-sm",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
  danger: "bg-danger-500 hover:bg-danger-600 text-white shadow-sm",
  success: "bg-success-500 hover:bg-success-600 text-white shadow-sm",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
};
const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-base" };

export default function Button({ children, variant = "primary", size = "md", loading, disabled, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
