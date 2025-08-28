import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md focus:ring-gray-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent focus:ring-blue-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm h-8",
    default: "px-6 py-3 text-sm h-10",
    lg: "px-8 py-4 text-base h-12"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed hover:shadow-lg" : "cursor-pointer";

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabledClasses,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;