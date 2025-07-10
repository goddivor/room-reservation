// src/components/ui/Button.tsx
import React, { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm",
      outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
      success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm",
    };

    const sizeClasses = {
      xs: "px-2.5 py-1.5 text-xs gap-1.5",
      sm: "px-3 py-2 text-sm gap-2",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-5 py-3 text-base gap-2.5",
      xl: "px-6 py-3.5 text-base gap-3",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${widthClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const iconSize = {
      xs: 14,
      sm: 16,
      md: 16,
      lg: 18,
      xl: 20,
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <div 
            className={`border-2 border-current border-t-transparent rounded-full animate-spin`}
            style={{ 
              width: iconSize[size], 
              height: iconSize[size] 
            }}
          />
        )}

        {/* Left Icon */}
        {!loading && leftIcon && (
          <span className="flex items-center">
            {leftIcon}
          </span>
        )}

        {/* Button Content */}
        {children && (
          <span className={loading ? 'ml-1' : ''}>
            {children}
          </span>
        )}

        {/* Right Icon */}
        {!loading && rightIcon && (
          <span className="flex items-center">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;