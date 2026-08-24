// src/components/shared/form/CustomInput.jsx
"use client";

const CustomInput = ({
  id,
  label,
  placeholder = "Enter...",
  type = "text",
  value,
  onChange,
  className,
}) => {
  return (
    <div className={`flex flex-col w-full ${className || ""}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm sm:text-base font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-700 dark:text-gray placeholder:text-gray-400 dark:placeholder:text-gray-600 rounded-md px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base h-[44px] sm:h-[48px] focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-150"
      />
    </div>
  );
};

export default CustomInput;
