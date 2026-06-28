"use client";

import { forwardRef, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.ComponentProps<"input"> {
  label: string;
  icon?: ElementType;
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, icon: Icon, ...props }, ref) => {
    const id = props.id ?? `input-${label.replace(/\s+/g, "-")}`;

    return (
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-all duration-200 group-focus-within:text-teal-500 peer-valid:text-teal-500 dark:group-focus-within:text-teal-400" />
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "peer h-14 w-full rounded-md border border-slate-300 bg-transparent px-4 pt-4 pb-2 text-base text-slate-800 dark:text-slate-200 placeholder-transparent focus:border-teal-500 focus:outline-none dark:border-slate-600 dark:focus:border-teal-400",
            Icon ? "pl-11 pr-4" : "pl-4 pr-4",
            className
          )}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute text-base text-slate-500 pointer-events-none transition-all duration-200 ease-in-out transform origin-top-left",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
            "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-teal-500 dark:peer-focus:text-teal-400",
            "peer-valid:top-2 peer-valid:-translate-y-0 peer-valid:text-xs peer-valid:text-teal-500 dark:peer-valid:text-teal-400",
            Icon ? "left-11" : "left-4"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";
