"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RefreshCw, FileText } from "lucide-react";
import EditableTitle from "./EditableTitle";
import EditablePost from "./EditablePost";

interface ResultCardProps {
  label: string;
  content: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  placeholder: string;
  isLoading?: boolean;
  heading?: string;
  isTitle?: boolean;
  grow?: boolean;
  accentColor: string;
}

export default function ResultCard({
  label,
  heading,
  content,
  onChange,
  onRegenerate,
  placeholder,
  isLoading = false,
  isTitle = false,
  grow = false,
  accentColor,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEmpty = !content;

  return (
    <div className={`rounded-[18px] border border-[#E5E7EB] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden${grow ? " flex flex-col flex-1 min-h-0" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-[3px] h-[16px] rounded-full flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-[13px] font-semibold text-[#111827] tracking-[-0.01em]">
            {heading ?? label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.button
            onClick={onRegenerate}
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.03 } : {}}
            whileTap={!isLoading ? { scale: 0.97 } : {}}
            className="
              inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px]
              text-[12px] font-medium text-[#6B7280]
              hover:bg-[#F3F4F6] hover:text-[#111827]
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors duration-150 cursor-pointer
            "
          >
            <RefreshCw size={11} strokeWidth={2} />
            Regenerate {label}
          </motion.button>

          <motion.button
            onClick={handleCopy}
            disabled={isEmpty || isLoading}
            whileHover={!isEmpty && !isLoading ? { scale: 1.03 } : {}}
            whileTap={!isEmpty && !isLoading ? { scale: 0.97 } : {}}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px]
              text-[12px] font-medium transition-all duration-150
              ${
                isEmpty || isLoading
                  ? "text-[#D1D5DB] cursor-not-allowed"
                  : copied
                  ? "text-[#15803D] bg-[#DCFCE7]"
                  : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] cursor-pointer"
              }
            `}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.12 }}
                  className="flex items-center gap-1.5"
                >
                  <Check size={12} strokeWidth={2.5} />
                  Copied ✓
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.12 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy size={12} strokeWidth={2} />
                  Copy {label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Body */}
      <div className={grow ? "px-5 pt-5 flex-1 min-h-0 overflow-hidden" : `px-5 ${isTitle ? "pt-4 pb-3" : "pt-5 pb-4"}`}>
        {isLoading ? (
          <div className="space-y-2.5">
            <div className="h-[18px] bg-[#F3F4F6] rounded-[6px] animate-pulse w-full" />
            {!isTitle && (
              <>
                <div className="h-[18px] bg-[#F3F4F6] rounded-[6px] animate-pulse w-[92%]" />
                <div className="h-[18px] bg-[#F3F4F6] rounded-[6px] animate-pulse w-[84%]" />
                <div className="h-[18px] bg-[#F3F4F6] rounded-[6px] animate-pulse w-[88%]" />
                <div className="h-[18px] bg-[#F3F4F6] rounded-[6px] animate-pulse w-[76%]" />
              </>
            )}
          </div>
        ) : isEmpty ? (
          <div className="flex items-center gap-2 text-[#D1D5DB] min-h-[40px]">
            <FileText size={14} strokeWidth={1.5} />
            <span className="text-[13px] font-normal">{placeholder}</span>
          </div>
        ) : isTitle ? (
          <EditableTitle value={content} onChange={onChange} accentColor={accentColor} />
        ) : (
          <EditablePost value={content} onChange={onChange} accentColor={accentColor} />
        )}
      </div>

      {/* Character count footer */}
      {!isLoading && content && (
        <div className="px-5 pb-3.5">
          <span className="text-[11px] font-medium text-[#C4C9D4] tabular-nums">
            {label} · {content.length.toLocaleString()} characters
          </span>
        </div>
      )}
    </div>
  );
}
