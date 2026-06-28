"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function GeminiConfig() {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("gemini_api_key");
    if (stored) {
      setKey(stored);
      setSaved(true);
    }
  }, []);

  const handleChange = (v: string) => {
    setKey(v);
    setSaved(false);
  };

  const handleSave = () => {
    if (!key.trim()) return;
    localStorage.setItem("gemini_api_key", key.trim());
    setSaved(true);
  };

  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white p-6 mb-4">
      <p className="text-[13px] font-medium text-[#666666] uppercase tracking-wider mb-4">
        Gemini Configuration
      </p>
      <div className="flex gap-3 items-center">
        <input
          type="password"
          value={key}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="Enter your Gemini API Key"
          className="
            flex-1 rounded-lg border border-[#e5e5e5] bg-white
            px-4 py-2.5 text-[14px] text-black placeholder:text-[#bbbbbb]
            outline-none focus:border-[#c0c0c0]
            transition-colors duration-150
          "
        />
        <button
          onClick={handleSave}
          className="
            px-4 py-2.5 rounded-lg bg-black text-white
            text-[14px] font-medium
            hover:bg-[#222222]
            transition-colors duration-150
            cursor-pointer whitespace-nowrap
          "
        >
          Save Key
        </button>
      </div>
      {saved && (
        <p className="mt-3 text-[13px] text-[#22c55e] flex items-center gap-1.5">
          <Check size={13} strokeWidth={2.5} />
          API Key Saved
        </p>
      )}
    </div>
  );
}
