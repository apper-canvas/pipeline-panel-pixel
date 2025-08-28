import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  placeholder,
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        placeholder={placeholder}
        className={cn(
          "flex w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "placeholder:text-gray-400 transition-all duration-200",
          "hover:border-gray-300 hover:shadow-sm",
          error && "border-red-300 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;