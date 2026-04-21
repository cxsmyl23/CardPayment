import { CardTypeInfo } from "../types/payment";

export const CARD_TYPES: CardTypeInfo[] = [
  {
    type: "amex",
    name: "American Express",
    lengths: [15],
    cvcLength: 4,
    format: (value) => {
      const parts = [value.slice(0, 4), value.slice(4, 10), value.slice(10, 15)];
      return parts.filter(Boolean).join(" ");
    },
    pattern: /^3[47]/,
  },
  {
    type: "visa",
    name: "Visa",
    lengths: [13, 16, 19],
    cvcLength: 3,
    format: (value) => {
      const parts = value.match(/.{1,4}/g);
      return parts ? parts.join(" ") : value;
    },
    pattern: /^4/,
  },
  {
    type: "mastercard",
    name: "Mastercard",
    lengths: [16],
    cvcLength: 3,
    format: (value) => {
      const parts = value.match(/.{1,4}/g);
      return parts ? parts.join(" ") : value;
    },
    pattern: /^(5[1-5]|2(2(2[1-9]|[3-9])|[3-6]|7([0-1]|20)))/,
  },
  {
    type: "discover",
    name: "Discover",
    lengths: [16],
    cvcLength: 3,
    format: (value) => {
      const parts = value.match(/.{1,4}/g);
      return parts ? parts.join(" ") : value;
    },
    pattern: /^6(011|5)/,
  },
];

const UNKNOWN_CARD: CardTypeInfo = {
  type: "unknown",
  name: "Unknown",
  lengths: [16],
  cvcLength: 3,
  format: (value) => {
    const parts = value.match(/.{1,4}/g);
    return parts ? parts.join(" ") : value;
  },
  pattern: /.*/,
};

export function detectCardType(cardNumber: string): CardTypeInfo {
  const cleaned = cardNumber.replace(/\s/g, "");
  for (const card of CARD_TYPES) {
    if (card.pattern.test(cleaned)) return card;
  }
  return UNKNOWN_CARD;
}
