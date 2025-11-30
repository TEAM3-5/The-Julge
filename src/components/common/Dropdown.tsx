'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type DropdownSize = 'large' | 'compact';

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  options: DropdownOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: DropdownSize;
  className?: string;
};

export default function Dropdown({
  options,
  placeholder = '선택',
  value,
  onChange,
  size = 'large',
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    onChange?.(option.value);
    setOpen(false);
  };

  const baseButton =
    size === 'large'
      ? 'h-14 w-full rounded-md border border-gray-30 bg-white px-4 text-left text-gray-40 text-base'
      : 'inline-flex items-center w-[120px] gap-2 rounded-md border border-gray-20 bg-gray-10 px-3 py-2 tj-body2-bold';

  const menuWidth = size === 'large' ? 'w-full min-w-[240px]' : 'w-[120px]';

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${baseButton} flex items-center justify-between`}
      >
        <span className={selectedOption ? 'text-gray-black' : 'text-gray-40'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          className={`absolute left-0 mt-2 rounded-xl border border-gray-20 bg-white shadow-lg ${menuWidth} max-h-60 overflow-auto z-10`}
        >
          <ul>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className="flex justify-center w-full items-center px-4 py-3 tj-body2 text-center hover:bg-gray-5"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.333 6.667 8 11.333l4.667-4.666"
        stroke="#111322"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
