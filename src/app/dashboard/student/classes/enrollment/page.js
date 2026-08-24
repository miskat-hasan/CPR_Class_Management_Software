"use client";

import { Suspense } from "react";
import SchedulePageContent from "@/components/enrollment/SchedulePageContent";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-6">
          <div className="flex-1 animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
          <div className="w-72 animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <SchedulePageContent />
    </Suspense>
  );
}
