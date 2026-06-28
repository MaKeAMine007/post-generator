"use client";

import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  accentColor: string;
}

export default function GenerateButton({ onClick, isLoading, accentColor }: GenerateButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      style={{ backgroundColor: accentColor }}
      whileHover={!isLoading ? { scale: 1.015, boxShadow: `0 6px 24px ${accentColor}45` } : {}}
      whileTap={!isLoading ? { scale: 0.985 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="
        w-full inline-flex items-center justify-center gap-2.5
        text-white font-medium text-[15px]
        h-[52px] rounded-[14px]
        disabled:opacity-60 disabled:cursor-not-allowed
        cursor-pointer
        shadow-[0_2px_8px_rgba(0,0,0,0.12)]
      "
    >
      {isLoading ? (
        <>
          <Loader2 size={17} strokeWidth={2} className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles size={17} strokeWidth={2} />
          Generate
        </>
      )}
    </motion.button>
  );
}
