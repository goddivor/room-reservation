// src/components/ui/Input.tsx
import React, { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      size = 'md',
      className = '',
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const baseClasses = "w-full border rounded-lg transition-colors focus:outline-none focus:ring-2";
    
    const variantClasses = {
      default: "border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20",
      outline: "border-gray-300 bg-transparent focus:border-blue-500 focus:ring-blue-500/20",
      filled: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500/20",
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-4 py-3 text-base",
    };

    const disabledClasses = disabled
      ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
      : "";

    const errorClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "";

    const iconPadding = {
      left: leftIcon ? (size === 'sm' ? 'pl-10' : size === 'lg' ? 'pl-12' : 'pl-11') : '',
      right: rightIcon ? (size === 'sm' ? 'pr-10' : size === 'lg' ? 'pr-12' : 'pr-11') : '',
    };

    const inputClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${disabledClasses}
      ${errorClasses}
      ${iconPadding.left}
      ${iconPadding.right}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            }`}>
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            disabled={disabled}
            required={required}
            className={inputClasses}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            }`}>
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <p className={`mt-1 text-xs ${
            error ? 'text-red-600' : 'text-gray-500'
          }`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export default Input;