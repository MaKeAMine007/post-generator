"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useProgressSimulation } from "@/hooks/useProgressSimulation";

interface ProgressSectionProps {
  isLoading: boolean;
  accentColor: string;
}

function getStatusText(progress: number): string {
  if (progress < 20) return "Analyzing topic and audience...";
  if (progress < 45) return "Crafting content structure...";
  if (progress < 70) return "Writing and refining...";
  if (progress < 90) return "Polishing final output...";
  return "Almost done...";
}

export default function ProgressSection({ isLoading, accentColor }: ProgressSectionProps) {
  const { progress, visible } = useProgressSimulation(isLoading);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="progress"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#FAFAFA] p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="text-[14px] font-medium text-[#374151]">
                  Generating content
                </span>
              </div>
              <span
                className="text-[13px] font-medium tabular-nums"
                style={{ color: accentColor }}
              >
                {progress}%
              </span>
            </div>

            <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: accentColor }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>

            <p className="text-[13px] font-normal text-[#9CA3AF]">{getStatusText(progress)}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
