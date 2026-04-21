export interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

export interface FormState {
  nameOnCard: FormField;
  cardNumber: FormField;
  expirationDate: FormField;
  cvc: FormField;
  streetAddress: FormField;
  aptSuite: FormField;
  city: FormField;
  state: FormField;
  zipCode: FormField;
}

export type CardType = "amex" | "visa" | "mastercard" | "discover" | "unknown";

export interface CardTypeInfo {
  type: CardType;
  name: string;
  lengths: number[];
  cvcLength: number;
  format: (value: string) => string;
  pattern: RegExp;
}
