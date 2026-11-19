import { ACCESS_DURATION_OPTIONS } from "../constants/course.constants";
import { PricingType } from "../types/course.types";

/**
 * Calculates discount percentage given actual and discounted prices.
 * Returns 0 if prices are invalid, equal, or if discount > actual.
 */
export function calculateDiscountPercentage(
  actualPrice: string | number,
  discountPrice: string | number
): number {
  const actual = Number(actualPrice);
  const discount = Number(discountPrice);

  if (isNaN(actual) || isNaN(discount) || actual <= 0 || discount <= 0 || discount >= actual) {
    return 0;
  }

  return Math.round(((actual - discount) / actual) * 100);
}

/**
 * Formats a number or numeric string as Indian Rupees currency format.
 */
export function formatCurrency(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Returns formatted price display depending on pricing type.
 */
export function formatPriceDisplay(
  price: string | number,
  pricingType: PricingType = "paid"
): string {
  if (pricingType === "free") return "Free";
  return formatCurrency(price);
}

/**
 * Retrieves human-readable label for a given access duration in days.
 */
export function getAccessDurationLabel(days: string | number): string {
  const matched = ACCESS_DURATION_OPTIONS.find((opt) => opt.value === String(days));
  return matched ? matched.label : `${days} Days`;
}

/**
 * Checks if a string is a valid HTTP/HTTPS URL.
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return /^https?:\/\/.+/i.test(url.trim());
}
