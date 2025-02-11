import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function joinQuery(
  query: Record<string, string | number | null | undefined>,
): string {
  let queryString = "?";

  Object.entries(query).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      queryString += `${key}=${encodeURIComponent(val.toString())}&`;
    }
  });

  // Remove the trailing '&' if it exists
  if (queryString.endsWith("&")) {
    queryString = queryString.slice(0, -1);
  }

  return queryString;
}
