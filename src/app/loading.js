"use client";

import React from "react";
import Loader from "@/components/common/Loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-dark transition-colors duration-300">
      {/* Glow Backdrop */}
      <div className="absolute w-72 h-72 bg-brown/10 dark:bg-brown/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Main Loader Content */}
      <div className="relative flex flex-col items-center gap-6 z-10">
        <div className="w-28 h-28 flex items-center justify-center">
          <Loader />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
            Loading
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-normal animate-pulse">
            Please wait while we prepare your page...
          </p>
        </div>

        {/* Pulsing indicator dots */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-brown animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-brown animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-brown animate-bounce" />
        </div>
      </div>
    </div>
  );
}
