import * as React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Lock, Shield, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

interface FormState {
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
// maps out which card it is going to be
type CardType = "amex" | "visa" | "mastercard" | "discover" | "unknown";

interface CardTypeInfo {
  type: CardType;
  name: string;
  lengths: number[];
  cvcLength: number;
  format: (value: string) => string;
  pattern: RegExp;
}

// method to determin the card type using our interface
const CARD_TYPES: CardTypeInfo[] = [
  {
    type: "amex",
    name: "American Express",
    lengths: [15],
    cvcLength: 4,
    format: (value: string) => {
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
    format: (value: string) => {
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
    format: (value: string) => {
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
    format: (value: string) => {
      const parts = value.match(/.{1,4}/g);
      return parts ? parts.join(" ") : value;
    },
    pattern: /^6(011|5)/,
  },
];
// list of states thank you AI for generating this for us
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];


export function PaymentForm() {
  const [formState, setFormState] = React.useState<FormState>({
    nameOnCard: { value: "", error: "", touched: false },
    cardNumber: { value: "", error: "", touched: false },
    expirationDate: { value: "", error: "", touched: false },
    cvc: { value: "", error: "", touched: false },
    streetAddress: { value: "", error: "", touched: false },
    aptSuite: { value: "", error: "", touched: false },
    city: { value: "", error: "", touched: false },
    state: { value: "", error: "", touched: false },
    zipCode: { value: "", error: "", touched: false },
  });

  const [cardType, setCardType] = React.useState<CardType>("unknown");

  // Detect card type from card number
  const detectCardType = (cardNumber: string): CardTypeInfo => {
    const cleaned = cardNumber.replace(/\s/g, "");
    
    for (const card of CARD_TYPES) {
      if (card.pattern.test(cleaned)) {
        return card;
      }
    }
    
    return {
      type: "unknown",
      name: "Unknown",
      lengths: [16],
      cvcLength: 3,
      format: (value: string) => {
        const parts = value.match(/.{1,4}/g);
        return parts ? parts.join(" ") : value;
      },
      pattern: /.*/,
    };
  };

  // Format card number based on card type
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const cardInfo = detectCardType(cleaned);
    return cardInfo.format(cleaned);
  };

  // Format expiration date as MM/YY
  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Format ZIP code
  const formatZipCode = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return cleaned.substring(0, 5) + "-" + cleaned.substring(5, 9);
  };

  // Get current card type info
  const getCurrentCardInfo = (): CardTypeInfo => {
    return detectCardType(formState.cardNumber.value);
  };

  // Validation functions
  const validateNameOnCard = (value: string) => {
    if (!value.trim()) return "Name on card is required";
    if (value.trim().length < 3) return "Name must be at least 3 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters";
    return "";
  };

  const validateCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (!cleaned) return "Card number is required";
    if (!/^\d+$/.test(cleaned)) return "Card number must contain only digits";
    
    const cardInfo = getCurrentCardInfo();
    
    if (cardInfo.type === "amex" && cleaned.length !== 15) {
      return "American Express cards must be 15 digits";
    }
    
    if (cardInfo.type === "visa") {
      if (cleaned.length < 13) return "Visa cards must be 13-19 digits";
      if (cleaned.length > 19) return "Visa cards must be 13-19 digits";
      if (cleaned.length !== 16 && cleaned.length !== 13 && cleaned.length !== 19) {
        return "Most Visa cards are 16 digits";
      }
    }
    
    if ((cardInfo.type === "mastercard" || cardInfo.type === "discover") && cleaned.length !== 16) {
      return `${cardInfo.name} cards must be 16 digits`;
    }
    
    if (cardInfo.type === "unknown" && cleaned.length < 13) {
      return "Card number is too short";
    }
    
    if (cleaned.length > 19) return "Card number is too long";
    
    return "";
  };

  const validateExpirationDate = (value: string) => {
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
  };

  const validateCVC = (value: string) => {
    const cardInfo = getCurrentCardInfo();
    
    if (!value) return "CVC is required";
    if (!/^\d+$/.test(value)) return "CVC must contain only digits";
    
    if (cardInfo.type === "amex") {
      if (value.length !== 4) return "American Express CVC must be 4 digits";
    } else {
      if (value.length !== 3) return "CVC must be 3 digits";
    }
    
    return "";
  };

  const validateStreetAddress = (value: string) => {
    if (!value.trim()) return "Street address is required";
    if (value.trim().length < 5) return "Please enter a valid street address";
    return "";
  };

  const validateCity = (value: string) => {
    if (!value.trim()) return "City is required";
    if (value.trim().length < 2) return "Please enter a valid city";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "City can only contain letters";
    return "";
  };

  const validateState = (value: string) => {
    if (!value) return "State is required";
    return "";
  };

  const validateZipCode = (value: string) => {
    if (!value) return "ZIP code is required";
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 5 && cleaned.length !== 9) {
      return "Enter a valid ZIP code";
    }
    return "";
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      const cleaned = value.replace(/\s/g, "");
      const maxLength = 19;
      
      if (cleaned.length <= maxLength && /^\d*$/.test(cleaned)) {
        formattedValue = formatCardNumber(cleaned);
        
        const newCardType = detectCardType(cleaned).type;
        if (newCardType !== cardType) {
          setCardType(newCardType);
        }
      } else {
        return;
      }
    } else if (field === "expirationDate") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 4) {
        formattedValue = formatExpirationDate(cleaned);
      } else {
        return;
      }
    } else if (field === "cvc") {
      const cardInfo = getCurrentCardInfo();
      const maxLength = cardInfo.cvcLength;
      
      if (value.length > maxLength || (value && !/^\d*$/.test(value))) {
        return;
      }
      formattedValue = value;
    } else if (field === "zipCode") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 9) {
        formattedValue = formatZipCode(cleaned);
      } else {
        return;
      }
    }

    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value: formattedValue,
      },
    }));
  };

  const handleStateChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        value,
        error: "",
      },
    }));
  };

  const handleFieldBlur = (field: keyof FormState) => {
    const value = formState[field].value;
    let error = "";

    switch (field) {
      case "nameOnCard":
        error = validateNameOnCard(value);
        break;
      case "cardNumber":
        error = validateCardNumber(value);
        break;
      case "expirationDate":
        error = validateExpirationDate(value);
        break;
      case "cvc":
        error = validateCVC(value);
        break;
      case "streetAddress":
        error = validateStreetAddress(value);
        break;
      case "city":
        error = validateCity(value);
        break;
      case "state":
        error = validateState(value);
        break;
      case "zipCode":
        error = validateZipCode(value);
        break;
    }

    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        error,
        touched: true,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newFormState = { ...formState };
    newFormState.nameOnCard.error = validateNameOnCard(formState.nameOnCard.value);
    newFormState.cardNumber.error = validateCardNumber(formState.cardNumber.value);
    newFormState.expirationDate.error = validateExpirationDate(formState.expirationDate.value);
    newFormState.cvc.error = validateCVC(formState.cvc.value);
    newFormState.streetAddress.error = validateStreetAddress(formState.streetAddress.value);
    newFormState.city.error = validateCity(formState.city.value);
    newFormState.state.error = validateState(formState.state.value);
    newFormState.zipCode.error = validateZipCode(formState.zipCode.value);

    // Mark all as touched except aptSuite (optional)
    Object.keys(newFormState).forEach((key) => {
      if (key !== "aptSuite") {
        newFormState[key as keyof FormState].touched = true;
      }
    });

    setFormState(newFormState);

    // Check if form is valid (excluding aptSuite which is optional)
    const isValid = !Object.entries(newFormState).some(
      ([key, field]) => key !== "aptSuite" && field.error
    );

    if (isValid) {
      alert("Payment submitted successfully!");
    }
  };

  const getFieldProps = (field: keyof FormState) => {
    const fieldState = formState[field];
    const hasError = fieldState.touched && fieldState.error;
    const isValid = fieldState.touched && !fieldState.error && fieldState.value;

    return {
      value: fieldState.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleFieldChange(field, e.target.value),
      onBlur: () => handleFieldBlur(field),
      "aria-invalid": hasError ? true : undefined,
      className: isValid
        ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50"
        : undefined,
    };
  };

  // Get card brand colors and styles
  const getCardStyles = () => {
    switch (cardType) {
      case "amex":
        return {
          gradient: "from-[#006FCF] via-[#0059A8] to-[#004A8F]",
          shadow: "shadow-2xl shadow-blue-900/30",
          textColor: "text-white",
          chipGradient: "from-[#C5A572] via-[#E8D4A8] to-[#B8935C]",
        };
      case "visa":
        return {
          gradient: "from-[#1A1F71] via-[#2E3A8C] to-[#1A1F71]",
          shadow: "shadow-2xl shadow-indigo-900/40",
          textColor: "text-white",
          chipGradient: "from-[#C5A572] via-[#E8D4A8] to-[#B8935C]",
        };
      case "mastercard":
        return {
          gradient: "from-[#1C1C1C] via-[#2A2A2A] to-[#1C1C1C]",
          shadow: "shadow-2xl shadow-gray-900/50",
          textColor: "text-white",
          chipGradient: "from-[#C5A572] via-[#E8D4A8] to-[#B8935C]",
        };
      case "discover":
        return {
          gradient: "from-[#E8E8E8] via-[#F5F5F5] to-[#DADADA]",
          shadow: "shadow-2xl shadow-gray-400/30",
          textColor: "text-gray-800",
          chipGradient: "from-[#C5A572] via-[#E8D4A8] to-[#B8935C]",
        };
      default:
        return {
          gradient: "from-[#4A5568] via-[#5A6678] to-[#4A5568]",
          shadow: "shadow-2xl shadow-gray-600/30",
          textColor: "text-white",
          chipGradient: "from-[#C5A572] via-[#E8D4A8] to-[#B8935C]",
        };
    }
  };

  const cardStyles = getCardStyles();
  const currentCardInfo = getCurrentCardInfo();

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2">Secure Checkout</h1>
        <p className="text-base text-gray-600">Complete your payment securely</p>
      </div>

      {/* Card Preview */}
      <div className="mb-8 flex justify-center perspective-[1000px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={cardType}
            initial={{ rotateY: 90, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className={`relative w-[540px] h-[340px] rounded-[20px] ${cardStyles.shadow}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Main card body */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${cardStyles.gradient} rounded-[20px] overflow-hidden`}
              style={{
                boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.15),
                  inset 0 -1px 2px rgba(0,0,0,0.1),
                  0 20px 60px rgba(0,0,0,0.3),
                  0 2px 8px rgba(0,0,0,0.15)
                `
              }}
            >
              {/* Noise/grain texture overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                }}
              />
              
              {/* Light reflection sweep */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: cardType === "discover" 
                    ? "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 55%, transparent 100%)"
                    : "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 100%)"
                }}
              />

              {/* Discover orange accent */}
              {cardType === "discover" && (
                <div 
                  className="absolute top-0 right-0 w-2/3 h-20 opacity-90"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, #FF6000 100%)",
                  }}
                />
              )}

              {/* Edge highlight */}
              <div 
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background: cardType === "discover" 
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
                }}
              />

              {/* Card content */}
              <div className={`relative z-10 h-full p-8 flex flex-col justify-between ${cardStyles.textColor}`}>
                {/* Top section - Brand logo & chip */}
                <div className="flex items-start justify-between">
                  {/* Brand Logos */}
                  <div className="flex items-center h-12">
                    {cardType === "amex" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <div className="bg-white rounded-sm px-4 py-2 shadow-md">
                          <div className="text-base font-extrabold tracking-tight text-[#006FCF]" style={{ letterSpacing: "0.05em" }}>
                            AMEX
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {cardType === "visa" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <div className="text-3xl font-extrabold italic text-white tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                          VISA
                        </div>
                      </motion.div>
                    )}
                    
                    {cardType === "mastercard" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#EB001B]" />
                        <div className="w-9 h-9 rounded-full bg-[#F79E1B] -ml-4" />
                      </motion.div>
                    )}
                    
                    {cardType === "discover" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <div 
                          className="text-xl font-bold text-[#FF6000] tracking-wide whitespace-nowrap" 
                          style={{ 
                            letterSpacing: "0.05em",
                            minWidth: "fit-content"
                          }}
                        >
                          DISCOVER
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* EMV Chip */}
                  <div 
                    className={`w-[52px] h-[42px] rounded-md bg-gradient-to-br ${cardStyles.chipGradient} relative`}
                    style={{
                      boxShadow: `
                        inset 0 -2px 4px rgba(0,0,0,0.3),
                        inset 0 1px 2px rgba(255,255,255,0.4),
                        0 2px 4px rgba(0,0,0,0.2)
                      `
                    }}
                  >
                    {/* Chip pattern */}
                    <div className="absolute inset-1.5 grid grid-cols-4 gap-[1px] p-1">
                      {[...Array(16)].map((_, i) => (
                        <div 
                          key={i} 
                          className="bg-gradient-to-br from-[#9B7F4A] to-[#8B6F3A] rounded-[1px]"
                          style={{
                            boxShadow: "inset 0 0.5px 1px rgba(0,0,0,0.3)"
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Chip highlight */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1/2 rounded-t-md"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)"
                      }}
                    />
                  </div>
                </div>

                {/* Contactless payment icon */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-20">
                  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="currentColor">
                    <path d="M20 8c-1.1 0-2 .9-2 2s.9 2 2 2c3.3 0 6 2.7 6 6 0 1.1.9 2 2 2s2-.9 2-2c0-5.5-4.5-10-10-10z"/>
                    <path d="M20 2c-1.1 0-2 .9-2 2s.9 2 2 2c7.7 0 14 6.3 14 14 0 1.1.9 2 2 2s2-.9 2-2c0-9.9-8.1-18-18-18z"/>
                    <path d="M20 14c-1.1 0-2 .9-2 2s.9 2 2 2c1.1 0 2 .9 2 2 0 1.1.9 2 2 2s2-.9 2-2c0-3.3-2.7-6-6-6z"/>
                  </svg>
                </div>

                {/* Card number */}
                <div className="relative">
                  <div 
                    className={`font-mono tracking-[0.25em] transition-all duration-200 ${
                      cardType === "amex" ? "text-[26px]" : "text-[28px]"
                    }`}
                    style={{
                      textShadow: cardType === "discover" 
                        ? "0 1px 2px rgba(0,0,0,0.15)"
                        : "0 2px 4px rgba(0,0,0,0.4)",
                      letterSpacing: cardType === "amex" ? "0.2em" : "0.25em",
                    }}
                  >
                    {formState.cardNumber.value || (
                      <span className={cardType === "discover" ? "text-gray-400" : "text-white/40"}>
                        •••• •••• •••• ••••
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom section - Name and expiry */}
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <div 
                      className={`text-[9px] uppercase tracking-wider mb-1 ${
                        cardType === "discover" ? "text-gray-500" : "text-white/60"
                      }`}
                      style={{ letterSpacing: "0.1em" }}
                    >
                      Card Holder
                    </div>
                    <div 
                      className="text-[15px] uppercase tracking-wider font-medium"
                      style={{
                        textShadow: cardType === "discover" 
                          ? "0 1px 2px rgba(0,0,0,0.1)"
                          : "0 1px 3px rgba(0,0,0,0.3)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {formState.nameOnCard.value || (
                        <span className={cardType === "discover" ? "text-gray-400" : "text-white/40"}>
                          YOUR NAME
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div 
                      className={`text-[9px] uppercase tracking-wider mb-1 ${
                        cardType === "discover" ? "text-gray-500" : "text-white/60"
                      }`}
                      style={{ letterSpacing: "0.1em" }}
                    >
                      Valid Thru
                    </div>
                    <div 
                      className="text-[15px] font-mono tracking-wider"
                      style={{
                        textShadow: cardType === "discover" 
                          ? "0 1px 2px rgba(0,0,0,0.1)"
                          : "0 1px 3px rgba(0,0,0,0.3)",
                      }}
                    >
                      {formState.expirationDate.value || (
                        <span className={cardType === "discover" ? "text-gray-400" : "text-white/40"}>
                          MM/YY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visa logo bottom right */}
                  {cardType === "visa" && (
                    <div className="ml-6">
                      <div className="text-xl font-bold italic opacity-80">VISA</div>
                    </div>
                  )}

                  {/* Mastercard logo bottom right */}
                  {cardType === "mastercard" && (
                    <div className="ml-6 flex items-center gap-[-4px]">
                      <div className="w-7 h-7 rounded-full bg-[#EB001B] opacity-80" />
                      <div className="w-7 h-7 rounded-full bg-[#F79E1B] opacity-80 -ml-3" />
                    </div>
                  )}
                </div>

                {/* Microtext / Bank info */}
                <div className={`absolute bottom-2 left-8 text-[7px] ${
                  cardType === "discover" ? "text-gray-400" : "text-white/30"
                } tracking-wide`}>
                  MEMBER FDIC
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Card Type Indicator */}
      {cardType !== "unknown" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full border border-emerald-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-900">
              {currentCardInfo.name} detected
            </span>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Information Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payment Information</h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="nameOnCard">Name on card</Label>
              {formState.nameOnCard.touched && formState.nameOnCard.error && (
                <span className="text-sm text-red-600">{formState.nameOnCard.error}</span>
              )}
              {formState.nameOnCard.touched &&
                !formState.nameOnCard.error &&
                formState.nameOnCard.value && (
                  <span className="text-sm text-green-600">✓ Valid</span>
                )}
            </div>
            <Input
              id="nameOnCard"
              placeholder="John Doe"
              {...getFieldProps("nameOnCard")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cardNumber">Card number</Label>
              {formState.cardNumber.touched && formState.cardNumber.error && (
                <span className="text-sm text-red-600">{formState.cardNumber.error}</span>
              )}
              {formState.cardNumber.touched &&
                !formState.cardNumber.error &&
                formState.cardNumber.value && (
                  <span className="text-sm text-green-600">✓ Valid</span>
                )}
            </div>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              {...getFieldProps("cardNumber")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expirationDate">Expiration</Label>
                {formState.expirationDate.touched && formState.expirationDate.error && (
                  <span className="text-sm text-red-600">
                    {formState.expirationDate.error}
                  </span>
                )}
                {formState.expirationDate.touched &&
                  !formState.expirationDate.error &&
                  formState.expirationDate.value && (
                    <span className="text-sm text-green-600">✓</span>
                  )}
              </div>
              <Input
                id="expirationDate"
                placeholder="MM/YY"
                {...getFieldProps("expirationDate")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cvc">CVC</Label>
                {formState.cvc.touched && formState.cvc.error && (
                  <span className="text-sm text-red-600">{formState.cvc.error}</span>
                )}
                {formState.cvc.touched && !formState.cvc.error && formState.cvc.value && (
                  <span className="text-sm text-green-600">✓</span>
                )}
              </div>
              <Input
                id="cvc"
                type="password"
                placeholder={cardType === "amex" ? "1234" : "123"}
                maxLength={currentCardInfo.cvcLength}
                {...getFieldProps("cvc")}
              />
            </div>
          </div>
        </div>

        {/* Billing Address Section */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <div>
            <h2 className="text-lg font-semibold">Billing Address</h2>
            <p className="text-sm text-gray-500 mt-1">
              We currently only support billing addresses within the United States
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="streetAddress">Street address</Label>
              {formState.streetAddress.touched && formState.streetAddress.error && (
                <span className="text-sm text-red-600">{formState.streetAddress.error}</span>
              )}
              {formState.streetAddress.touched &&
                !formState.streetAddress.error &&
                formState.streetAddress.value && (
                  <span className="text-sm text-green-600">✓ Valid</span>
                )}
            </div>
            <Input
              id="streetAddress"
              placeholder="123 Main St"
              {...getFieldProps("streetAddress")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aptSuite">Apt / Suite (optional)</Label>
            <Input
              id="aptSuite"
              placeholder="Apt, suite, etc. (optional)"
              {...getFieldProps("aptSuite")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="city">City</Label>
                {formState.city.touched && formState.city.error && (
                  <span className="text-sm text-red-600">{formState.city.error}</span>
                )}
                {formState.city.touched &&
                  !formState.city.error &&
                  formState.city.value && (
                    <span className="text-sm text-green-600">✓</span>
                  )}
              </div>
              <Input
                id="city"
                placeholder="City"
                {...getFieldProps("city")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="state">State</Label>
                {formState.state.touched && formState.state.error && (
                  <span className="text-sm text-red-600">{formState.state.error}</span>
                )}
                {formState.state.touched &&
                  !formState.state.error &&
                  formState.state.value && (
                    <span className="text-sm text-green-600">✓</span>
                  )}
              </div>
              <Select
                value={formState.state.value}
                onValueChange={handleStateChange}
              >
                <SelectTrigger
                  id="state"
                  className={
                    formState.state.touched && !formState.state.error && formState.state.value
                      ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50"
                      : formState.state.touched && formState.state.error
                      ? "aria-[invalid=true]:border-destructive"
                      : ""
                  }
                  aria-invalid={formState.state.touched && formState.state.error ? true : undefined}
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="zipCode">ZIP code</Label>
                {formState.zipCode.touched && formState.zipCode.error && (
                  <span className="text-sm text-red-600">{formState.zipCode.error}</span>
                )}
                {formState.zipCode.touched &&
                  !formState.zipCode.error &&
                  formState.zipCode.value && (
                    <span className="text-sm text-green-600">✓</span>
                  )}
              </div>
              <Input
                id="zipCode"
                placeholder="12345"
                {...getFieldProps("zipCode")}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white h-12 rounded-lg text-base shadow-lg hover:shadow-xl transition-all"
          >
            <Lock className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Secure checkout</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>US billing only</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
