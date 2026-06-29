"use client";

import { useSearchParams } from "next/navigation";
import { useGetCourseSchedule } from "@/hooks/api/dashboardApi";
import EnrollSidebar from "@/components/enrollment/EnrollSidebar";
import Schedule from "@/components/enrollment/Schedule";

export default function SchedulePageContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");

  const { data, isLoading } = useGetCourseSchedule(courseId);

  const siteSettings = data?.data?.site_settings;

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-zinc-700">
          Class Schedule
        </h1>

        <Schedule />
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <EnrollSidebar siteSettings={siteSettings} />
      </div>
    </div>
  );
}
