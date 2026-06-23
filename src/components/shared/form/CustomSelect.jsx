"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn utility for merging classes
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [open, setOpen] = useState(false);

  // Helper function to extract the display label based on your dynamic data keys
  const getOptionLabel = opt => {
    if (!opt) return "";
    return (
      opt.name ??
      opt.name ??
      opt.training_center_name ??
      opt.company ??
      opt.course_name ??
      opt.title ??
      `${opt.first_name || ""} ${opt.last_name || ""}`.trim()
    );
  };

  // Find the currently selected option object to display its label in the trigger
  const selectedOption = options.find(opt => String(opt.id) === String(value));

  return (
    <div className={cn("flex flex-col gap-2 sm:gap-3 w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal border bg-light dark:hover:bg-dark/50 dark:bg-dark rounded-md px-2 sm:px-3 py-2 sm:h-12 text-sm sm:text-base text-gray-700 dark:text-[#b9b6b1] focus:outline-none cursor-pointer focus:ring-2 transition-all duration-150",
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 dark:border-[#3b4042] focus:ring-gray-300",
            )}
          >
            <span className="truncate">
              {selectedOption ? getOptionLabel(selectedOption) : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 dark:bg-black dark:border-[#3b4042]">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandList className="max-h-60 lg:max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : options?.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm text-gray-500 dark:bg-black">
                  No data found.
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {options.map(opt => {
                    const optionLabel = getOptionLabel(opt);
                    const isSelected = String(opt.id) === String(value);

                    return (
                      <CommandItem
                        key={opt.id}
                        value={optionLabel} // This is what the fuzzy search matches against
                        onSelect={() => {
                          // Toggle logic or simple select logic
                          onChange(
                            String(opt.id) === String(value)
                              ? ""
                              : String(opt.id),
                          );
                          setOpen(false);
                        }}
                        className="text-sm cursor-pointer flex items-center justify-between dark:text-[#b9b6b1] dark:aria-selected:bg-dark"
                      >
                        <span className="truncate">{optionLabel}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error Message */}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default CustomSelect;
