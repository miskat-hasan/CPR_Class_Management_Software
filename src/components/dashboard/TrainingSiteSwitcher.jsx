// src/components/common/TrainingSiteSwitcher.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

const TrainingSiteSwitcher = ({
  options,
  value,
  isLoading,
  onChange,
  placeholder = "Select training site",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const current = options.find(o => String(o.id) === String(value));

  const filtered = useMemo(() => {
    if (!search) return options;
    return options.filter(o =>
      o.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = id => {
    setOpen(false);
    setSearch("");
    onChange(id);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-[10px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-sm text-left cursor-pointer"
      >
        <span className="truncate text-gray-900 dark:text-gray">
          {isLoading ? "Loading..." : current?.name || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 max-h-80 overflow-y-auto rounded-[10px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-black shadow-lg">
          <div className="p-2 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-black">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-7 pr-2 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none dark:text-gray"
              />
            </div>
          </div>

          <div className="py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-400">No results</div>
            )}
            {filtered.map(o => {
              const isSelected = String(o.id) === String(value);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => handleSelect(o.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    isSelected ? "bg-gray-50 dark:bg-gray-800 font-medium" : ""
                  }`}
                >
                  <span className="truncate text-gray-900 dark:text-gray">
                    {o.name}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-brown dark:text-dark-brown flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingSiteSwitcher;
