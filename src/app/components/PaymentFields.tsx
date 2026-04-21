import * as React from "react";
import { Input } from "./ui/input";
import { FormState, CardType, CardTypeInfo } from "../../types/payment";
import { FieldWrapper } from "./FieldWrapper";

interface PaymentFieldsProps {
  formState: Pick<FormState, "nameOnCard" | "cardNumber" | "expirationDate" | "cvc">;
  cardType: CardType;
  currentCardInfo: CardTypeInfo;
  getFieldProps: (field: keyof FormState) => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    "aria-invalid"?: true;
    className?: string;
  };
}

export function PaymentFields({
  formState,
  cardType,
  currentCardInfo,
  getFieldProps,
}: PaymentFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Payment Information</h2>

      <FieldWrapper
        htmlFor="nameOnCard"
        label="Name on card"
        touched={formState.nameOnCard.touched}
        error={formState.nameOnCard.error}
        value={formState.nameOnCard.value}
        validText="✓ Valid"
      >
        <Input id="nameOnCard" placeholder="John Doe" {...getFieldProps("nameOnCard")} />
      </FieldWrapper>

      <FieldWrapper
        htmlFor="cardNumber"
        label="Card number"
        touched={formState.cardNumber.touched}
        error={formState.cardNumber.error}
        value={formState.cardNumber.value}
        validText="✓ Valid"
      >
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          {...getFieldProps("cardNumber")}
        />
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-4">
        <FieldWrapper
          htmlFor="expirationDate"
          label="Expiration"
          touched={formState.expirationDate.touched}
          error={formState.expirationDate.error}
          value={formState.expirationDate.value}
        >
          <Input id="expirationDate" placeholder="MM/YY" {...getFieldProps("expirationDate")} />
        </FieldWrapper>

        <FieldWrapper
          htmlFor="cvc"
          label="CVC"
          touched={formState.cvc.touched}
          error={formState.cvc.error}
          value={formState.cvc.value}
        >
          <Input
            id="cvc"
            type="password"
            placeholder={cardType === "amex" ? "1234" : "123"}
            maxLength={currentCardInfo.cvcLength}
            {...getFieldProps("cvc")}
          />
        </FieldWrapper>
      </div>
    </div>
  );
}
