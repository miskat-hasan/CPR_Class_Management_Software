import React from "react";

const SectionTitle = ({ className, title }) => {
  return (
    <div
      className={`text-black dark:text-white text-[20px] lg:text-[24px] font-semibold leading-[32.5px] ${className}`}
    >
      {title}
    </div>
  );
};

export default SectionTitle;
