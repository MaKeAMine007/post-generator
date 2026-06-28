"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center mb-10"
    >
      <h1 className="text-[36px] font-bold tracking-[-0.02em] text-[#111827] leading-tight">
        AI Content Generator
      </h1>
    </motion.div>
  );
}
