import { Lock, Shield, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { CardPreview } from "./CardPreview";
import { PaymentFields } from "./PaymentFields";
import { BillingAddressFields } from "./BillingAddressFields";
import { usePaymentForm } from "../../hooks/usePaymentForm";

export function PaymentForm() {
  const {
    formState,
    cardType,
    currentCardInfo,
    getFieldProps,
    handleStateChange,
    handleFieldBlur,
    handleSubmit,
  } = usePaymentForm();

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2">Secure Checkout</h1>
        <p className="text-base text-gray-600">
          Complete your payment securely
        </p>
      </div>

      <CardPreview
        cardType={cardType}
        cardNumber={formState.cardNumber.value}
        nameOnCard={formState.nameOnCard.value}
        expirationDate={formState.expirationDate.value}
      />

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentFields
          formState={formState}
          cardType={cardType}
          currentCardInfo={currentCardInfo}
          getFieldProps={getFieldProps}
        />

        <BillingAddressFields
          formState={formState}
          getFieldProps={getFieldProps}
          handleStateChange={handleStateChange}
          handleFieldBlur={handleFieldBlur}
        />

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full border-2 border-black/40 bg-gradient-to-r from-white/20 to-black/200 hover:from-gray-100 hover:to-gray-400 text-black/70 h-12 backdrop-blur-3xl rounded-lg text-base shadow-lg hover:shadow-xl transition-all"
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
