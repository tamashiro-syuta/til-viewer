import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToYYYYMMDD(date: Date) {
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

export function formatDateToYYYYMMDD(date: Date): number {
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月は0から始まるため +1
  const day = String(date.getDate()).padStart(2, "0"); // 日を2桁で表示

  return Number(`${year}${month}${day}`);
}

export function formatYYYYMMDDToDate(input: string): Date {
  const year = input.slice(0, 4);
  const month = input.slice(4, 6);
  const day = input.slice(6, 8);

  return new Date(`${year}-${month}-${day}`);
}
