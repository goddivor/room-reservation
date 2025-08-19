import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, disabled = false, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value)
    
    const currentValue = value || internalValue
    const percentage = ((currentValue[0] - min) / (max - min)) * 100

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseInt(e.target.value)]
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute h-full bg-slate-900 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue[0]}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 h-2 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <div
          className="block h-5 w-5 rounded-full border-2 border-slate-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          style={{ left: `calc(${percentage}% - 10px)`, position: 'absolute' }}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }