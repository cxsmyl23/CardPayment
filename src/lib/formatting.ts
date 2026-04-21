import { detectCardType } from "./cardTypes";

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, "");
  return detectCardType(cleaned).format(cleaned);
}

export function formatExpirationDate(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
  }
  return cleaned;
}

export function formatZipCode(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 5) return cleaned;
  return cleaned.substring(0, 5) + "-" + cleaned.substring(5, 9);
}
