"use client";

import Image from "next/image";
import { History } from "lucide-react";

interface NavbarProps {
  onHistoryClick: () => void;
}

export default function Navbar({ onHistoryClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 h-[64px] bg-white border-b border-[#E5E7EB] flex items-center flex-shrink-0">
      <div className="w-full max-w-[1450px] mx-auto px-9 flex items-center justify-between">
        {/* Logo */}
        <Image
          src="/logo.jpg"
          alt="Make A Mine"
          height={38}
          width={38}
          style={{ height: "38px", width: "auto" }}
          priority
        />

        {/* Actions */}
        <button
          onClick={onHistoryClick}
          className="
            inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px]
            text-[13px] font-medium text-[#6B7280]
            bg-[#F3F4F6] hover:bg-[#E5E7EB] hover:text-[#111827]
            transition-colors duration-150 cursor-pointer
          "
        >
          <History size={14} strokeWidth={2} />
          History
        </button>
      </div>
    </header>
  );
}
