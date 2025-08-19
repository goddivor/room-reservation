/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <div className="relative">
      <input
        type="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50",
          "appearance-none bg-white checked:bg-slate-900 checked:border-slate-900",
          className
        )}
        ref={ref}
        {...props}
      />
      <Check className="absolute left-0 top-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
    </div>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }