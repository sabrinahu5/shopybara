import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// helper to make it easier to conditionally add Tailwind CSS classes
// https://ui.shadcn.com/docs/installation
// More usage: https://www.neorepo.com/blog/how-to-build-a-button-with-nextjs-and-shadcn-ui

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
