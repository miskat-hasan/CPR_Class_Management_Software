"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

const MultiSelect = ({
  id,
  label,
  placeholder = "Select...",
  options = [],
  value = [],
  isLoading,
  onChange,
  className,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selected = Array.isArray(value) ? value.map(String) : [];

  const toggle = optId => {
    const strId = String(optId);
    const next = selected.includes(strId)
      ? selected.filter(v => v !== strId)
      : [...selected, strId];
    onChange(next);
  };

  const removeItem = (optId, e) => {
    e.stopPropagation();
    onChange(selected.filter(v => v !== String(optId)));
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getLabel = opt =>
    opt.name ??
    opt.training_center_name ??
    opt.company ??
    opt.course_name ??
    opt.title ??
    `${opt.first_name ?? ""} ${opt.last_name ?? ""}`.trim();

  const filteredOptions = options.filter(opt =>
    getLabel(opt).toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOptions = options.filter(o => selected.includes(String(o.id)));

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-2 w-full ${className || ""}`}
    >
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => setOpen(p => !p)}
        className={`relative w-full min-h-[48px] border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } bg-light dark:bg-black rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray cursor-pointer flex items-center flex-wrap gap-1.5 transition-all duration-150 ${
          open ? "ring-2 ring-gray-300 dark:ring-gray-600" : ""
        }`}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500">
            {placeholder}
          </span>
        ) : (
          selectedOptions.map(opt => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 bg-brown/10 dark:bg-dark-brown/20 text-brown dark:text-gray text-xs font-medium px-2 py-1 rounded-md"
            >
              {getLabel(opt)}
              <FaTimes
                className="size-2.5 cursor-pointer hover:text-red-500"
                onClick={e => removeItem(opt.id, e)}
              />
            </span>
          ))
        )}

        <FaChevronDown
          className={`ml-auto size-3 text-gray-400 dark:text-gray-500 transition-transform shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="relative z-50">
          <div className="absolute top-0 left-0 w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            {/* Search */}
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                placeholder="Search..."
                className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 dark:bg-dark dark:text-gray rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              />
            </div>

            {/* Options */}
            <div className="max-h-52 overflow-y-auto">
              {isLoading ? (
                <div className="px-3 py-3 text-sm text-gray-400 dark:text-gray-500">
                  Loading...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-3 py-3 text-sm text-gray-400 dark:text-gray-500">
                  {search ? "No results found" : "No options available"}
                </div>
              ) : (
                filteredOptions.map(opt => {
                  const isSelected = selected.includes(String(opt.id));
                  return (
                    <div
                      key={opt.id}
                      onClick={e => {
                        e.stopPropagation();
                        toggle(opt.id);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-brown/5 dark:bg-dark-brown/10 text-brown dark:text-gray font-medium"
                          : "text-gray-700 dark:text-gray hover:bg-gray-50 dark:hover:bg-dark"
                      }`}
                    >
                      <div
                        className={`size-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-brown dark:bg-dark-brown border-brown dark:border-dark-brown"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            viewBox="0 0 10 8"
                            className="size-2.5 fill-white"
                          >
                            <path
                              d="M1 4l3 3 5-6"
                              stroke="white"
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      {getLabel(opt)}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer: selected count + clear */}
            {selected.length > 0 && (
              <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {selected.length} selected
                </span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                  className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default MultiSelect;
