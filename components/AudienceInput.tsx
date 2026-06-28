"use client";

import { useState } from "react";

interface AudienceInputProps {
  value: string;
  onChange: (value: string) => void;
  accentColor: string;
  placeholder?: string;
}

export default function AudienceInput({ value, onChange, accentColor, placeholder = "e.g. Developers" }: AudienceInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-[14px] font-medium text-[#111827]">
        Audience
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          height: "48px",
          borderColor: focused ? accentColor : "#E5E7EB",
          boxShadow: focused ? `0 0 0 3px ${accentColor}25` : "0 1px 2px rgba(0,0,0,0.04)",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          fontFamily: "inherit",
        }}
        className="
          w-full rounded-[12px] border bg-white
          px-4 text-[16px] font-normal text-[#111827] placeholder:text-[#C4C9D4]
        "
      />
    </div>
  );
}
