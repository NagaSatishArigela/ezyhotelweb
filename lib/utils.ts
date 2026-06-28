import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const inputCls = (hasError: boolean, extra = "") =>
  cn(
    "w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all",
    hasError ? "border-red-400" : "border-gray-200",
    extra
  );
