"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { HistoryEntry } from "@/lib/historyStorage";

interface HistoryItemProps {
  entry: HistoryEntry;
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

const PLATFORM_COLORS = {
  reddit: { bg: "#FFF0EB", text: "#FF6B35" },
  quora: { bg: "#FFF0EF", text: "#B92B27" },
};

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryItem({ entry, onRestore, onDelete }: HistoryItemProps) {
  const colors = PLATFORM_COLORS[entry.platform];
  // Support both new (keyword) and old (topic) history entries
  const keyword = entry.keyword || (entry as unknown as { topic?: string }).topic || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-[12px] border border-[#F3F4F6] bg-white hover:border-[#E5E7EB] hover:shadow-[0_1px_6px_rgba(0,0,0,0.04)] transition-all duration-150 cursor-pointer"
      onClick={() => onRestore(entry)}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {entry.platform}
              </span>
              <span className="text-[11px] text-[#9CA3AF] tabular-nums">
                {formatTime(entry.timestamp)}
              </span>
            </div>
            <p className="text-[13px] font-medium text-[#111827] leading-snug line-clamp-2">
              {entry.title || keyword}
            </p>
            {entry.title && keyword && (
              <p className="text-[12px] text-[#9CA3AF] mt-1 truncate">{keyword}</p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            className="
              flex-shrink-0 p-1.5 rounded-[6px]
              text-[#D1D5DB] hover:text-red-400 hover:bg-red-50
              opacity-0 group-hover:opacity-100
              transition-all duration-150 cursor-pointer
            "
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
