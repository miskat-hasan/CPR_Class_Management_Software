"use client";

import React from "react";
import Loader from "@/components/common/Loader";

export default function DashboardLoading() {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-light dark:bg-dark transition-colors duration-300">
      <div className="relative flex flex-col items-center gap-5">
        <div className="w-24 h-24 flex items-center justify-center">
          <Loader />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Loading dashboard section...
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Please wait
          </span>
        </div>
      </div>
    </div>
  );
}
