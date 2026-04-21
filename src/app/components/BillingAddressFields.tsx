import * as React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormState } from "../../types/payment";
import { US_STATES } from "../../lib/constants";
import { FieldWrapper } from "./FieldWrapper";

interface BillingAddressFieldsProps {
  formState: Pick<FormState, "streetAddress" | "aptSuite" | "city" | "state" | "zipCode">;
  getFieldProps: (field: keyof FormState) => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    "aria-invalid"?: true;
    className?: string;
  };
  handleStateChange: (value: string) => void;
  handleFieldBlur: (field: keyof FormState) => void;
}

export function BillingAddressFields({
  formState,
  getFieldProps,
  handleStateChange,
  handleFieldBlur,
}: BillingAddressFieldsProps) {
  const stateField = formState.state;
  const stateIsValid = stateField.touched && !stateField.error && stateField.value;
  const stateHasError = stateField.touched && stateField.error;

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      <div>
        <h2 className="text-lg font-semibold">Billing Address</h2>
        <p className="text-sm text-gray-500 mt-1">
          We currently only support billing addresses within the United States
        </p>
      </div>

      <FieldWrapper
        htmlFor="streetAddress"
        label="Street address"
        touched={formState.streetAddress.touched}
        error={formState.streetAddress.error}
        value={formState.streetAddress.value}
        validText="✓ Valid"
      >
        <Input
          id="streetAddress"
          placeholder="123 Main St"
          {...getFieldProps("streetAddress")}
        />
      </FieldWrapper>

      <div className="space-y-2">
        <Label htmlFor="aptSuite">Apt / Suite (optional)</Label>
        <Input
          id="aptSuite"
          placeholder="Apt, suite, etc. (optional)"
          {...getFieldProps("aptSuite")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FieldWrapper
          htmlFor="city"
          label="City"
          touched={formState.city.touched}
          error={formState.city.error}
          value={formState.city.value}
        >
          <Input id="city" placeholder="City" {...getFieldProps("city")} />
        </FieldWrapper>

        {/* State uses a Select, so validation display is handled inline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="state">State</Label>
            {stateHasError && (
              <span className="text-sm text-red-600">{stateField.error}</span>
            )}
            {stateIsValid && (
              <span className="text-sm text-green-600">✓</span>
            )}
          </div>
          <Select value={stateField.value} onValueChange={handleStateChange}>
            <SelectTrigger
              id="state"
              className={
                stateIsValid
                  ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50"
                  : stateHasError
                  ? "aria-[invalid=true]:border-destructive"
                  : ""
              }
              aria-invalid={stateHasError ? true : undefined}
              onBlur={() => handleFieldBlur("state")}
            >
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FieldWrapper
          htmlFor="zipCode"
          label="ZIP code"
          touched={formState.zipCode.touched}
          error={formState.zipCode.error}
          value={formState.zipCode.value}
        >
          <Input id="zipCode" placeholder="12345" {...getFieldProps("zipCode")} />
        </FieldWrapper>
      </div>
    </div>
  );
}
