import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TENANTS_ROUTE } from "../data/routes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantURL(tenantSlug: string) {
  return `${TENANTS_ROUTE}/${tenantSlug}`;
}
