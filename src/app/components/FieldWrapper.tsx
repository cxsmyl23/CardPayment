import * as React from "react";
import { Label } from "./ui/label";

interface FieldWrapperProps {
  htmlFor: string;
  label: string;
  touched: boolean;
  error: string;
  value: string;
  validText?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  htmlFor,
  label,
  touched,
  error,
  value,
  validText = "✓",
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor}>{label}</Label>
        {touched && error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
        {touched && !error && value && (
          <span className="text-sm text-green-600">{validText}</span>
        )}
      </div>
      {children}
    </div>
  );
}
