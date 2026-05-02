"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon, Check } from "lucide-react";

interface FilterOption<T> {
  id: T;
  label: string;
  icon?: LucideIcon;
  renderIcon?: (active: boolean) => React.ReactNode;
}

interface FilterDropdownProps<T> {
  label: string;
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  icon: LucideIcon;
  title: string;
  className?: string;
}

export default function FilterDropdown<T>({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  title,
  className = "",
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:shadow-sm ${
          isOpen 
            ? "border-blue-500 bg-blue-500/5 text-blue-500" 
            : "border-(--border) bg-(--card) text-(--foreground) hover:border-blue-500/50"
        }`}
      >
        <Icon size={14} className={value !== options[0].id || isOpen ? "text-blue-500" : "text-(--muted)"} />
        <span className="truncate max-w-[80px] sm:max-w-[150px]">{label}</span>
        <ChevronDown size={14} className={`text-(--muted) transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-[60] mt-2 w-52 origin-top-left rounded-2xl border border-(--border) bg-(--card) p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="mb-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted)">{title}</div>
          <div className="max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar">
            {options.map((option) => (
              <button
                key={String(option.id)}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                  value === option.id ? "bg-blue-500/10 text-blue-500" : "hover:bg-(--accent)"
                }`}
              >
                {option.renderIcon ? (
                  option.renderIcon(value === option.id)
                ) : option.icon ? (
                  <option.icon size={14} className={value === option.id ? "text-blue-500" : "text-(--muted)"} />
                ) : null}
                <span className="truncate">{option.label}</span>
                {value === option.id && <Check size={14} className="ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
