import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToYYYYMMDD(date: Date) {
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}
