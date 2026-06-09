"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CustomSelect = ({
  id,
  label,
  placeholder = "Select...",
  options = [],
  value,
  isLoading,
  onChange,
  className,
  error,
}) => {
  return (
    <div className={`flex flex-col gap-2 sm:gap-3 w-full ${className || ""}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray"
        >
          {label}
        </label>
      )}

      <Select
        value={value ? String(value) : ""}
        onValueChange={(val) => onChange(val)}
      >
        <SelectTrigger
          id={id}
          className={`w-full border ${error ? "border-red-500" : "border-gray-300 dark:border-[#3b4042]"} bg-light dark:hover:bg-dark dark:focus:ring-0 dark:bg-dark rounded-md px-2 sm:px-3 py-2 sm:!py-6 text-sm sm:text-base text-gray-700 dark:text-[#b9b6b1] focus:outline-none cursor-pointer focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-gray-300"} transition-all duration-150
          `}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="max-h-60 lg:max-h-80 overflow-y-auto dark:bg-black dark:border-[#3b4042] dark:text-[#b9b6b1]">
          {isLoading ? (
            <div>Loading ....</div>
          ) : options?.length > 0 ? (
            options.map((opt) => (
              <SelectItem
                key={opt.id}
                value={String(opt.id)}
                className="text-sm cursor-pointer"
              >
                {opt.name ??
                  opt?.training_center_name ??
                  opt?.company ??
                  opt?.course_name ??
                  opt?.title ??
                  opt?.first_name + " " + opt?.last_name}
              </SelectItem>
            ))
          ) : (
            <p className="cursor-auto">No data found</p>
          )}
        </SelectContent>
      </Select>

      {/* Error Message */}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default CustomSelect;
