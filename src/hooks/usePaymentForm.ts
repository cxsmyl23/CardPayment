import * as React from "react";
import { FormState, CardType } from "../types/payment";
import { detectCardType } from "../lib/cardTypes";
import {
  formatCardNumber,
  formatExpirationDate,
  formatZipCode,
} from "../lib/formatting";
import {
  validateNameOnCard,
  validateCardNumber,
  validateExpirationDate,
  validateCVC,
  validateStreetAddress,
  validateCity,
  validateState,
  validateZipCode,
} from "../lib/validation";

const INITIAL_FORM_STATE: FormState = {
  nameOnCard: { value: "", error: "", touched: false },
  cardNumber: { value: "", error: "", touched: false },
  expirationDate: { value: "", error: "", touched: false },
  cvc: { value: "", error: "", touched: false },
  streetAddress: { value: "", error: "", touched: false },
  aptSuite: { value: "", error: "", touched: false },
  city: { value: "", error: "", touched: false },
  state: { value: "", error: "", touched: false },
  zipCode: { value: "", error: "", touched: false },
};

export function usePaymentForm() {
  const [formState, setFormState] =
    React.useState<FormState>(INITIAL_FORM_STATE);
  const [cardType, setCardType] = React.useState<CardType>("unknown");

  const currentCardInfo = detectCardType(formState.cardNumber.value);
  // using a switch here to get the field error
  const getValidationError = (
    field: keyof FormState,
    value: string,
  ): string => {
    switch (field) {
      case "nameOnCard":
        return validateNameOnCard(value);
      case "cardNumber":
        return validateCardNumber(value, currentCardInfo);
      case "expirationDate":
        return validateExpirationDate(value);
      case "cvc":
        return validateCVC(value, currentCardInfo);
      case "streetAddress":
        return validateStreetAddress(value);
      case "city":
        return validateCity(value);
      case "state":
        return validateState(value);
      case "zipCode":
        return validateZipCode(value);
      default:
        return "";
    }
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
    let formattedValue = value;

    if (field === "nameOnCard") {
      if (value && !/^[a-zA-Z\s]*$/.test(value)) return;
      if (value.length > 26) return;
    } else if (field === "cardNumber") {
      const cleaned = value.replace(/\s/g, "");
      if (cleaned.length > 19 || !/^\d*$/.test(cleaned)) return;
      formattedValue = formatCardNumber(cleaned);
      const newCardType = detectCardType(cleaned).type;
      if (newCardType !== cardType) setCardType(newCardType);
    } else if (field === "expirationDate") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length > 4) return;
      formattedValue = formatExpirationDate(cleaned);
    } else if (field === "cvc") {
      if (
        value.length > currentCardInfo.cvcLength ||
        (value && !/^\d*$/.test(value))
      )
        return;
    } else if (field === "zipCode") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length > 9) return;
      formattedValue = formatZipCode(cleaned);
    }

    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], value: formattedValue },
    }));
  };

  const handleStateChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      state: { ...prev.state, value, error: "" },
    }));
  };

  const handleFieldBlur = (field: keyof FormState) => {
    const error = getValidationError(field, formState[field].value);
    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], error, touched: true },
    }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const newFormState = { ...formState };
    (Object.keys(newFormState) as Array<keyof FormState>).forEach((key) => {
      if (key !== "aptSuite") {
        newFormState[key] = {
          ...newFormState[key],
          error: getValidationError(key, newFormState[key].value),
          touched: true,
        };
      }
    });

    setFormState(newFormState);

    const isValid = !Object.entries(newFormState).some(
      ([key, field]) => key !== "aptSuite" && field.error,
    );

    if (isValid) {
      setCardType("unknown");
      setFormState(INITIAL_FORM_STATE);
      alert("Payment submitted successfully!");
    }
  };

  const getFieldProps = (field: keyof FormState) => {
    const fieldState = formState[field];
    const isValid = fieldState.touched && !fieldState.error && fieldState.value;

    return {
      value: fieldState.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleFieldChange(field, e.target.value),
      onBlur: () => handleFieldBlur(field),
      "aria-invalid": (fieldState.touched && fieldState.error
        ? true
        : undefined) as true | undefined,
      className: isValid
        ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50"
        : undefined,
    };
  };

  return {
    formState,
    cardType,
    currentCardInfo,
    getFieldProps,
    handleStateChange,
    handleFieldBlur,
    handleSubmit,
  };
}
