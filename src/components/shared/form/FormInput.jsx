"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const FormInput = ({
  name,
  label,
  description,
  placeholder,
  className,
  rules,
  type,
  ...props
}) => {
  const form = useFormContext();
  const location = usePathname();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const resolvedType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  const isLightBg =
    location === "/admin/clients/add_client" ||
    location === "/admin/instructors/add_instructor";

  return (
    <FormField
      control={form.control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col gap-1.5 sm:gap-2">
          {label && (
            <FormLabel className="leading-[1.45] font-medium text-sm sm:text-base text-gray-700 dark:text-gray">
              {label}
            </FormLabel>
          )}

          <FormControl>
            <div className="relative">
              <Input
                className={cn(
                  `
                  w-full
                  rounded-xl sm:rounded-2xl
                  px-3 sm:px-4 py-2.5 sm:py-6
                  text-sm sm:text-base
                  font-normal leading-[1.45]
                  placeholder:text-gray-400
                  dark:placeholder:text-neutral-500
                  dark:hover:border-neutral-500
                  focus:outline-none
                  focus-visible:ring-2 focus-visible:ring-gray-300
                  border border-border-secondary hover:border-gray-400
                  transition-all duration-150
                  `,
                  isPasswordField && "pr-10 sm:pr-12",
                  isLightBg ? "bg-light" : "bg-transparent",
                  className,
                )}
                type={resolvedType}
                placeholder={placeholder}
                {...field}
                {...props}
              />

              {isPasswordField && (
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 dark:text-neutral-400" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 dark:text-neutral-400" />
                  )}
                </button>
              )}
            </div>
          </FormControl>

          {description && (
            <FormDescription className="text-xs sm:text-sm text-gray-500">
              {description}
            </FormDescription>
          )}

          <FormMessage className="text-right text-xs sm:text-sm text-destructive font-normal" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
