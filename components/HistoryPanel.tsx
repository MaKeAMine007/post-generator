"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import type { HistoryEntry } from "@/lib/historyStorage";
import HistoryItem from "./HistoryItem";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (entry: HistoryEntry) => void;
}

function groupByDate(entries: HistoryEntry[]): { label: string; items: HistoryEntry[] }[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;

  const groups: { label: string; items: HistoryEntry[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Older", items: [] },
  ];

  entries.forEach((entry) => {
    if (entry.timestamp >= todayStart) groups[0].items.push(entry);
    else if (entry.timestamp >= yesterdayStart) groups[1].items.push(entry);
    else groups[2].items.push(entry);
  });

  return groups.filter((g) => g.items.length > 0);
}

export default function HistoryPanel({ isOpen, onClose, onRestore }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setShowClearConfirm(false);
    setIsLoadingHistory(true);
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setIsLoadingHistory(false));
  }, [isOpen]);

  const handleDelete = async (id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
    } catch {
      // Silently ignore
    }
  };

  const handleClear = async () => {
    setHistory([]);
    setShowClearConfirm(false);
    try {
      await fetch("/api/history", { method: "DELETE" });
    } catch {
      // Silently ignore
    }
  };

  const groups = groupByDate(history);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.8 }}
            className="fixed top-0 right-0 h-full w-[380px] max-w-full bg-[#F8F9FB] border-l border-[#E5E7EB] shadow-[-4px_0_24px_rgba(0,0,0,0.06)] z-50 flex flex-col"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <Clock size={15} strokeWidth={2} className="text-[#6B7280]" />
                <span className="text-[14px] font-semibold text-[#111827]">History</span>
                {history.length > 0 && (
                  <span className="text-[11px] font-medium text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full tabular-nums">
                    {history.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {history.length > 0 && (
                  <>
                    {showClearConfirm ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleClear}
                          className="text-[12px] font-medium text-red-500 hover:text-red-600 cursor-pointer transition-colors"
                        >
                          Confirm
                        </button>
                        <span className="text-[#D1D5DB] text-[12px]">·</span>
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="text-[12px] font-medium text-[#6B7280] hover:text-[#111827] cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="text-[12px] font-medium text-[#9CA3AF] hover:text-red-400 cursor-pointer transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-[8px] text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#E5E7EB] border-t-[#9CA3AF] animate-spin" />
                  <p className="text-[13px] text-[#9CA3AF]">Loading...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                  <Clock size={32} strokeWidth={1.5} className="text-[#D1D5DB]" />
                  <p className="text-[14px] font-medium text-[#9CA3AF]">No history yet</p>
                  <p className="text-[13px] text-[#C4C9D4]">
                    Generated content will appear here
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-5">
                  {groups.map(({ label, items }) => (
                    <div key={label}>
                      <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2 px-1">
                        {label}
                      </p>
                      <AnimatePresence initial={false}>
                        <div className="space-y-2">
                          {items.map((entry) => (
                            <HistoryItem
                              key={entry.id}
                              entry={entry}
                              onRestore={(e) => {
                                onRestore(e);
                                onClose();
                              }}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
