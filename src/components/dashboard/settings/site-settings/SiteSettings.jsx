// src/components/dashboard/site-settings/SiteSettings.jsx
"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import BasicSiteSettingsForm from "./BasicSiteSettingsForm";
import RegistrationSettingsForm from "./RegistrationSettingsForm";
import CustomRegistrationQuestions from "./CustomRegistrationQuestions";

const TABS = [
  { key: "basic", label: "Basic Site Settings" },
  { key: "registration", label: "Registration Settings" },
];

const SiteSettings = () => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title="Site Settings" />

      {/* Tab strip */}
      <div className="flex gap-1 bg-white dark:bg-black rounded-[14px] p-1.5 w-fit shadow-sm">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all cursor-pointer ${
              activeTab === key
                ? "bg-brown dark:bg-dark-brown text-white shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px]">
        {activeTab === "basic" && <BasicSiteSettingsForm />}
        {activeTab === "registration" && <RegistrationSettingsForm />}
      </div>

      {/* Custom Registration Questions — always visible below */}
      <CustomRegistrationQuestions />
    </section>
  );
};

export default SiteSettings;
