/* eslint-disable react-refresh/only-export-components */
import type { PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeClassName = cva(
  "flex items-center px-4 py-1 font-medium rounded transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800",
        info: "bg-blue-100 text-blue-600",
        success: "bg-green-100 text-green-600",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-600",
        secondary: "bg-gray-200 text-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = PropsWithChildren<{
  className?: string;
  variant?: "default" | "info" | "success" | "warning" | "danger" | "secondary";
}> & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeClassName>;

export default function Badge({
  children,
  className,
  variant = "default",
  ...rest
}: BadgeProps) {
  return (
    <div className={cn(badgeClassName({ variant }), className)} {...rest}>
      {children}
    </div>
  );
}
