import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isWeekend() {
  const day = new Date().getDay() // 0 = domingo, 6 = sábado
  return day === 0 || day === 6
}