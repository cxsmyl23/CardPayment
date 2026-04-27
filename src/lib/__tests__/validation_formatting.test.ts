import { describe, it, expect } from "vitest";
import { validateCardNumber } from "../validation";
import { formatExpirationDate } from "../formatting";
import { CardTypeInfo } from "../../types/payment";

function makeCard(
  type: CardTypeInfo["type"],
  name: string,
  overrides: Partial<CardTypeInfo> = {},
): CardTypeInfo {
  return {
    type,
    name,
    lengths: [],
    cvcLength: 3,
    format: (v) => v,
    pattern: /.*/,
    ...overrides,
  };
}

const visaCard = makeCard("visa", "Visa");
const amexCard = makeCard("amex", "American Express", { cvcLength: 4 });
const mastercardCard = makeCard("mastercard", "Mastercard");
const discoverCard = makeCard("discover", "Discover");
const unknownCard = makeCard("unknown", "Unknown");

// --- validateCardNumber test---

describe("validateCardNumber", () => {
  it("returns error for empty string", () => {
    expect(validateCardNumber("", visaCard)).toBe("Card number is required");
  });

  it("returns error for whitespace-only input", () => {
    expect(validateCardNumber("   ", visaCard)).toBe("Card number is required");
  });

  it("returns error when non-digit characters are present", () => {
    expect(validateCardNumber("4111-1111-1111-1111", visaCard)).toBe(
      "Card number must contain only digits",
    );
  });

  it("returns error for unknown card type with 6+ digits", () => {
    expect(validateCardNumber("999999", unknownCard)).toBe(
      "Card type not recognized",
    );
  });

  it("returns error for unknown card type with fewer than 6 digits", () => {
    expect(validateCardNumber("123", unknownCard)).toBe(
      "Card number is too short",
    );
  });

  it("accepts valid 16-digit Visa number", () => {
    expect(validateCardNumber("4111111111111111", visaCard)).toBe("");
  });

  it("accepts valid 13-digit Visa number", () => {
    expect(validateCardNumber("4111111111111", visaCard)).toBe("");
  });

  it("returns error for Visa number shorter than 13 digits", () => {
    expect(validateCardNumber("411111111111", visaCard)).toBe(
      "Visa cards must be 13-19 digits",
    );
  });

  it("returns error for Visa number longer than 19 digits", () => {
    expect(validateCardNumber("41111111111111111111", visaCard)).toBe(
      "Visa cards must be 13-19 digits",
    );
  });

  it("returns warning for Visa number that is not 13, 16, or 19 digits", () => {
    expect(validateCardNumber("41111111111111", visaCard)).toBe(
      "Most Visa cards are 16 digits",
    );
  });

  it("accepts valid 15-digit Amex number", () => {
    expect(validateCardNumber("378282246310005", amexCard)).toBe("");
  });

  it("returns error for Amex number that is not 15 digits", () => {
    expect(validateCardNumber("3782822463100051", amexCard)).toBe(
      "American Express cards must be 15 digits",
    );
  });

  it("accepts valid 16-digit Mastercard number", () => {
    expect(validateCardNumber("5500005555555559", mastercardCard)).toBe("");
  });

  it("returns error for Mastercard number that is not 16 digits", () => {
    expect(validateCardNumber("550000555555555", mastercardCard)).toBe(
      "Mastercard cards must be 16 digits",
    );
  });

  it("accepts valid 16-digit Discover number", () => {
    expect(validateCardNumber("6011111111111117", discoverCard)).toBe("");
  });

  it("returns error for Discover number that is not 16 digits", () => {
    expect(validateCardNumber("601111111111111", discoverCard)).toBe(
      "Discover cards must be 16 digits",
    );
  });

  it("strips spaces before validating", () => {
    expect(validateCardNumber("4111 1111 1111 1111", visaCard)).toBe("");
  });
});

// --- expiration test ---

describe("formatExpirationDate", () => {
  it("returns empty string for empty input", () => {
    expect(formatExpirationDate("")).toBe("");
  });

  it("returns single digit unchanged", () => {
    expect(formatExpirationDate("1")).toBe("1");
  });

  it("inserts slash after two digits", () => {
    expect(formatExpirationDate("12")).toBe("12/");
  });

  it("formats a full MM/YY value correctly", () => {
    expect(formatExpirationDate("1228")).toBe("12/28");
  });

  it("strips non-digit characters before formatting", () => {
    expect(formatExpirationDate("12/28")).toBe("12/28");
  });

  it("truncates input beyond 4 digits", () => {
    expect(formatExpirationDate("122899")).toBe("12/28");
  });

  it("handles leading zeros in month", () => {
    expect(formatExpirationDate("0130")).toBe("01/30");
  });
});
