"use client";

import { motion } from "framer-motion";

type Platform = "reddit" | "quora";

interface PlatformSelectorProps {
  value: Platform;
  onChange: (value: Platform) => void;
  accentColor: string;
}

const platforms: { id: Platform; label: string }[] = [
  { id: "reddit", label: "Reddit" },
  { id: "quora", label: "Quora" },
];

export default function PlatformSelector({ value, onChange, accentColor }: PlatformSelectorProps) {
  return (
    <div className="space-y-2.5">
      <label className="block text-[13px] font-medium text-[#6B7280] uppercase tracking-wider">
        Platform
      </label>
      <div className="relative inline-flex items-center bg-[#F3F4F6] rounded-[12px] p-1 gap-0.5 w-full">
        {platforms.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="relative flex-1 py-2.5 rounded-[9px] text-[14px] font-medium transition-colors duration-200 cursor-pointer z-10"
          >
            {value === id && (
              <motion.span
                layoutId="platform-pill"
                className="absolute inset-0 rounded-[9px] shadow-sm z-[-1]"
                style={{ backgroundColor: accentColor }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
            <motion.span
              className="relative"
              animate={{ color: value === id ? "#ffffff" : "#6B7280" }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          </button>
        ))}
      </div>
    </div>
  );
}
