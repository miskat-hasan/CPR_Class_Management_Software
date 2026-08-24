import Link from "next/link";
import React from "react";
import { ArrowIcon } from "@/components/svg/SvgContainer";
import SubSectionTitle from "../../common/SubSectionTitle";

const InfoCard = ({ icon, title, linkText, linkHref, className = "" }) => {
  return (
    <div
      className={`w-full md:w-[384px] h-[136px] p-4 sm:p-5 bg-white dark:bg-black rounded-[20px] flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <div
          className="w-[45px] h-[45px] flex items-center justify-center rounded-full 
          bg-[linear-gradient(180deg,_#FF9A9A_0%,_#B70000_100%)]"
        >
          {icon}
        </div>

        <SubSectionTitle
          className="text-[16px] sm:text-[20px]"
          subtitle={title}
        />
      </div>

      <Link
        href={linkHref}
        className="flex items-center justify-between text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        {linkText} <ArrowIcon />
      </Link>
    </div>
  );
};

export default InfoCard;
