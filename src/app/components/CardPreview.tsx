import { motion, AnimatePresence } from "framer-motion";
import { CardType } from "../../types/payment";

interface CardPreviewProps {
  cardType: CardType;
  cardNumber: string;
  nameOnCard: string;
  expirationDate: string;
}

interface CardStyles {
  gradient: string;
  shadow: string;
  textColor: string;
  chipGradient: string;
}

function getCardStyles(cardType: CardType): CardStyles {
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
}

function BrandLogo({ cardType }: { cardType: CardType }) {
  if (cardType === "amex") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white rounded-sm px-4 py-2 shadow-md">
          <div
            className="text-base font-extrabold tracking-tight text-[#006FCF]"
            style={{ letterSpacing: "0.05em" }}
          >
            AMEX
          </div>
        </div>
      </motion.div>
    );
  }

  if (cardType === "visa") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="text-3xl font-extrabold italic text-white tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          VISA
        </div>
      </motion.div>
    );
  }

  if (cardType === "mastercard") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center"
      >
        <div className="w-9 h-9 rounded-full bg-[#EB001B]" />
        <div className="w-9 h-9 rounded-full bg-[#F79E1B] -ml-4" />
      </motion.div>
    );
  }

  if (cardType === "discover") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="text-xl font-bold text-[#FF6000] tracking-wide whitespace-nowrap"
          style={{ letterSpacing: "0.05em", minWidth: "fit-content" }}
        >
          DISCOVER
        </div>
      </motion.div>
    );
  }

  return null;
}

function EMVChip({ chipGradient }: { chipGradient: string }) {
  return (
    <div
      className={`w-[52px] h-[42px] rounded-md bg-gradient-to-br ${chipGradient} relative`}
      style={{
        boxShadow:
          "inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <div className="absolute inset-1.5 grid grid-cols-4 gap-[1px] p-1">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-[#9B7F4A] to-[#8B6F3A] rounded-[1px]"
            style={{ boxShadow: "inset 0 0.5px 1px rgba(0,0,0,0.3)" }}
          />
        ))}
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-md"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)" }}
      />
    </div>
  );
}

function BottomBrandAccent({ cardType }: { cardType: CardType }) {
  if (cardType === "visa") {
    return (
      <div className="ml-6">
        <div className="text-xl font-bold italic opacity-80">VISA</div>
      </div>
    );
  }

  if (cardType === "mastercard") {
    return (
      <div className="ml-6 flex items-center gap-[-4px]">
        <div className="w-7 h-7 rounded-full bg-[#EB001B] opacity-80" />
        <div className="w-7 h-7 rounded-full bg-[#F79E1B] opacity-80 -ml-3" />
      </div>
    );
  }

  return null;
}

export function CardPreview({ cardType, cardNumber, nameOnCard, expirationDate }: CardPreviewProps) {
  const styles = getCardStyles(cardType);

  return (
    <div className="mb-8 flex justify-center perspective-[1000px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={cardType}
          initial={{ rotateY: 90, opacity: 0, scale: 0.95 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          exit={{ rotateY: -90, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className={`relative w-[540px] h-[340px] rounded-[20px] ${styles.shadow}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} rounded-[20px] overflow-hidden`}
            style={{
              boxShadow:
                "inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {/* Grain texture */}
            <div
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
              }}
            />

            {/* Light reflection */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  cardType === "discover"
                    ? "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 55%, transparent 100%)"
                    : "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 100%)",
              }}
            />

            {/* Discover orange accent */}
            {cardType === "discover" && (
              <div
                className="absolute top-0 right-0 w-2/3 h-20 opacity-90"
                style={{ background: "linear-gradient(90deg, transparent 0%, #FF6000 100%)" }}
              />
            )}

            {/* Edge highlight */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background:
                  cardType === "discover"
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              }}
            />

            <div
              className={`relative z-10 h-full p-8 flex flex-col justify-between ${styles.textColor}`}
            >
              {/* Top row: brand logo + EMV chip */}
              <div className="flex items-start justify-between">
                <div className="flex items-center h-12">
                  <BrandLogo cardType={cardType} />
                </div>
                <EMVChip chipGradient={styles.chipGradient} />
              </div>

              {/* Contactless icon */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-20">
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="currentColor">
                  <path d="M20 8c-1.1 0-2 .9-2 2s.9 2 2 2c3.3 0 6 2.7 6 6 0 1.1.9 2 2 2s2-.9 2-2c0-5.5-4.5-10-10-10z" />
                  <path d="M20 2c-1.1 0-2 .9-2 2s.9 2 2 2c7.7 0 14 6.3 14 14 0 1.1.9 2 2 2s2-.9 2-2c0-9.9-8.1-18-18-18z" />
                  <path d="M20 14c-1.1 0-2 .9-2 2s.9 2 2 2c1.1 0 2 .9 2 2 0 1.1.9 2 2 2s2-.9 2-2c0-3.3-2.7-6-6-6z" />
                </svg>
              </div>

              {/* Card number */}
              <div className="relative">
                <div
                  className={`font-mono tracking-[0.25em] transition-all duration-200 ${
                    cardType === "amex" ? "text-[26px]" : "text-[28px]"
                  }`}
                  style={{
                    textShadow:
                      cardType === "discover"
                        ? "0 1px 2px rgba(0,0,0,0.15)"
                        : "0 2px 4px rgba(0,0,0,0.4)",
                    letterSpacing: cardType === "amex" ? "0.2em" : "0.25em",
                  }}
                >
                  {cardNumber || (
                    <span className={cardType === "discover" ? "text-gray-400" : "text-white/40"}>
                      •••• •••• •••• ••••
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom row: cardholder + expiry + brand accent */}
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
                    className="text-[15px] uppercase tracking-wider font-medium truncate max-w-[240px]"
                    style={{
                      textShadow:
                        cardType === "discover"
                          ? "0 1px 2px rgba(0,0,0,0.1)"
                          : "0 1px 3px rgba(0,0,0,0.3)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {nameOnCard || (
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
                      textShadow:
                        cardType === "discover"
                          ? "0 1px 2px rgba(0,0,0,0.1)"
                          : "0 1px 3px rgba(0,0,0,0.3)",
                    }}
                  >
                    {expirationDate || (
                      <span className={cardType === "discover" ? "text-gray-400" : "text-white/40"}>
                        MM/YY
                      </span>
                    )}
                  </div>
                </div>

                <BottomBrandAccent cardType={cardType} />
              </div>

              {/* FDIC microtext */}
              <div
                className={`absolute bottom-2 left-8 text-[7px] ${
                  cardType === "discover" ? "text-gray-400" : "text-white/30"
                } tracking-wide`}
              >
                MEMBER FDIC
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
