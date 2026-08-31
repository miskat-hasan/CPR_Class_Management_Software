// src/components/enrollment/SchedulePageContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetCourseSchedule } from "@/hooks/api/dashboardApi";
import Schedule, { EMPTY_FILTERS } from "@/components/enrollment/Schedule";

const STORAGE_KEY = "scheduleFilters";

/** Read locked filter params from sessionStorage. */
export function getStoredFilters() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function SchedulePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tsId = searchParams.get("ts_id");
    const courseId = searchParams.get("course_id");
    const instructorId = searchParams.get("instructor_id");
    const locationId = searchParams.get("location_id");

    const hasUrlParams = tsId || courseId || instructorId || locationId;

    if (hasUrlParams) {
      // Persist the locked params
      const locked = {
        ...(tsId ? { ts_id: tsId } : {}),
        ...(courseId ? { course_id: courseId } : {}),
        ...(instructorId ? { instructor_id: instructorId } : {}),
        ...(locationId ? { location_id: locationId } : {}),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(locked));

      // Redirect to clean URL
      router.replace("/schedule");
      return;
    }

    setReady(true);
  }, [searchParams, router]);

  // ── Read locked params from sessionStorage (safe on server: returns {}) ──
  const stored = getStoredFilters();

  const hiddenFilters = {
    course_id: stored.course_id || "",
    instructor_id: stored.instructor_id || "",
    location_id: stored.location_id || "",
  };

  const tsId = stored.ts_id || "1";
  const instructorId = stored.instructor_id;

  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    ...hiddenFilters,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    ...EMPTY_FILTERS,
    ...hiddenFilters,
  });
  const [page, setPage] = useState(1);

  // ── Step 1: On mount, capture any URL params → sessionStorage → redirect ──
  const [ready, setReady] = useState(false);

  // ── Clear course filter:
  const handleClearCourseFilter = () => {
    const current = getStoredFilters();
    delete current.course_id;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));

    setFilters(prev => ({ ...prev, course_id: "" }));
    setAppliedFilters(prev => ({ ...prev, course_id: "" }));
  };

  const { data, isLoading } = useGetCourseSchedule(tsId, instructorId, {
    ...appliedFilters,
    page,
  });

  const settings = data?.data?.settings;

  if (!ready) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-zinc-700">
          Enrollment
        </h1>

        <Schedule
          data={data}
          isLoading={isLoading}
          filters={filters}
          setFilters={setFilters}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
          page={page}
          setPage={setPage}
          hiddenFilters={hiddenFilters}
          onClearCourseFilter={handleClearCourseFilter}
        />
      </div>

      {/* ── Sidebar ── */}
      <div className="w-full lg:max-w-[300px] shrink-0">
        <div className="flex flex-col gap-4">
          {/* Secure Site */}
          <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-2 border-b border-gray-200 dark:border-zinc-700">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                Secure Site
              </h3>
            </div>
            <div className="px-4 py-3 flex gap-3 items-start">
              <img
                src="https://codeblueservices.enrollware.com/reg/img/lock.png"
                alt="Secure"
                className="size-10 shrink-0 mt-0.5"
              />
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Please be assured that your information is protected and secure.
                We value your privacy and do not provide customer information to
                any third parties.
              </p>
            </div>
          </div>

          {/* Contact Us */}
          {settings && settings.length !== 0 && (
            <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-2 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                  Contact Us
                </h3>
              </div>
              <div className="px-4 py-3 flex flex-col gap-0.5 text-sm">
                {settings.company_name && (
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {settings.company_name}
                  </p>
                )}
                {settings.tag_line && (
                  <p className="font-semibold text-gray-700 dark:text-zinc-300">
                    {settings.tag_line}
                  </p>
                )}
                <div className="text-gray-600 dark:text-zinc-400 mt-1 text-xs leading-5">
                  {settings.address_1 && <p>{settings.address_1}</p>}
                  {settings.address_2 && <p>{settings.address_2}</p>}
                  {(settings.city || settings.state || settings.zip_code) && (
                    <p>
                      {[settings.city, settings.state, settings.zip_code]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {settings.phone && <p className="mt-1">{settings.phone}</p>}
                  {settings.email_address && (
                    <a
                      href={`mailto:${settings.email_address}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {settings.email_address}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Custom Sidebar HTML */}
          {settings?.custom_sidebar_html && (
            <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm px-4 py-3">
              <div
                
                className="prose prose-sm dark:text-white text-black max-w-none text-xs leading-relaxed
                  [&_ol]:list-decimal [&_ol]:pl-5
                  [&_li[data-list=bullet]]:list-disc [&_li[data-list=bullet]]:ml-6"
                dangerouslySetInnerHTML={{
                  __html: settings.custom_sidebar_html
                    ?.replace(/background-color:\s*[^;]+;?/g, "")
                    ?.replace(/color:\s*[^;]+;?/g, ""),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
