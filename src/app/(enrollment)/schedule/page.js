// src/app/enroll/[id]/page.js
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { getEnrollmentDetails } from "@/hooks/api/dashboardApi";
import EnrollSidebar from "@/components/enrollment/EnrollSidebar";
import Schedule from "@/components/enrollment/Schedule";

const Page = () => {

  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");

  const { data, isLoading } = getEnrollmentDetails(courseId)

  const siteSettings = data?.data?.site_settings;

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-zinc-700">
          Class Schedule
        </h1>

        <Schedule />
      </div>

      {/* ── Sidebar ── */}
      <div className="w-full lg:w-72 shrink-0">
        <EnrollSidebar siteSettings={siteSettings} />
      </div>
    </div>
  );
};

export default Page;
