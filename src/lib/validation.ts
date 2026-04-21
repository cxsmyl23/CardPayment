import { CardTypeInfo } from "../types/payment";

export function validateNameOnCard(value: string): string {
  if (!value.trim()) return "Name on card is required";
  if (value.trim().length < 3) return "Name must be at least 3 characters";
  if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters";
  return "";
}

export function validateCardNumber(
  value: string,
  cardInfo: CardTypeInfo,
): string {
  const cleaned = value.replace(/\s/g, "");
  if (!cleaned) return "Card number is required";
  if (!/^\d+$/.test(cleaned)) return "Card number must contain only digits";

  if (cardInfo.type === "unknown") {
    if (cleaned.length >= 6) return "Card type not recognized";
    return "Card number is too short";
  }

  if (cardInfo.type === "amex" && cleaned.length !== 15) {
    return "American Express cards must be 15 digits";
  }

  if (cardInfo.type === "visa") {
    if (cleaned.length < 13) return "Visa cards must be 13-19 digits";
    if (cleaned.length > 19) return "Visa cards must be 13-19 digits";
    if (
      cleaned.length !== 16 &&
      cleaned.length !== 13 &&
      cleaned.length !== 19
    ) {
      return "Most Visa cards are 16 digits";
    }
  }

  if (
    (cardInfo.type === "mastercard" || cardInfo.type === "discover") &&
    cleaned.length !== 16
  ) {
    return `${cardInfo.name} cards must be 16 digits`;
  }

  return "";
}

export function validateExpirationDate(value: string): string {
  if (!value) return "Expiration date is required";
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length < 4) return "Expiration date must be MM/YY format";

  const month = parseInt(cleaned.substring(0, 2));
  const year = parseInt(cleaned.substring(2, 4));

  if (month < 1 || month > 12) return "Invalid month (01-12)";

  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired";
  }

  return "";
}

export function validateCVC(value: string, cardInfo: CardTypeInfo): string {
  if (!value) return "CVC is required";
  if (!/^\d+$/.test(value)) return "CVC must contain only digits";

  if (cardInfo.type === "amex") {
    if (value.length !== 4) return "American Express CVC must be 4 digits";
  } else {
    if (value.length !== 3) return "CVC must be 3 digits";
  }

  return "";
}

export function validateStreetAddress(value: string): string {
  if (!value.trim()) return "Street address is required";
  if (value.trim().length < 5) return "Please enter a valid street address";
  return "";
}

export function validateCity(value: string): string {
  if (!value.trim()) return "City is required";
  if (value.trim().length < 2) return "Please enter a valid city";
  if (!/^[a-zA-Z\s]+$/.test(value)) return "City can only contain letters";
  return "";
}

export function validateState(value: string): string {
  if (!value) return "State is required";
  return "";
}

export function validateZipCode(value: string): string {
  if (!value) return "ZIP code is required";
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length !== 5 && cleaned.length !== 9)
    return "Enter a valid ZIP code";
  return "";
}
