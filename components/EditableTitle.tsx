"use client";

interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
  accentColor: string;
}

export default function EditableTitle({ value, onChange, accentColor }: EditableTitleProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Title will appear here"
      style={{ fontFamily: "inherit", caretColor: accentColor }}
      className="
        w-full bg-transparent border-none outline-none
        text-[20px] font-semibold text-[#111827] tracking-[-0.02em] leading-snug
        placeholder:text-[#D1D5DB]
      "
    />
  );
}
