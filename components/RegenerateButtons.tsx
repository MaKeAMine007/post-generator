"use client";

import { RefreshCw } from "lucide-react";

interface RegenerateButtonsProps {
  onRegenerateAll: () => void;
  isLoading: boolean;
}

export default function RegenerateButtons({ onRegenerateAll, isLoading }: RegenerateButtonsProps) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onRegenerateAll}
        disabled={isLoading}
        className="
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]
          text-[13px] font-medium text-[#6B7280]
          bg-white border border-[#E5E7EB]
          hover:border-[#D1D5DB] hover:text-[#111827]
          disabled:opacity-40 disabled:cursor-not-allowed
          shadow-[0_1px_3px_rgba(0,0,0,0.04)]
          transition-colors duration-150 cursor-pointer
        "
      >
        <RefreshCw size={12} strokeWidth={2} />
        Regenerate All
      </button>
    </div>
  );
}
