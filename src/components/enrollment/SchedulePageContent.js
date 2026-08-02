// src/components/enrollment/SchedulePageContent.jsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetCourseSchedule } from "@/hooks/api/dashboardApi";
import Schedule, { EMPTY_FILTERS, TRAINING_SITE_ID } from "@/components/enrollment/Schedule";

export default function SchedulePageContent() {
  const searchParams = useSearchParams();

  // Pre-fill filters from URL search params on first render,
  // e.g. /schedule?course_id=5 or /schedule?instructor_id=3
  const initialFromUrl = {
    ...EMPTY_FILTERS,
    course_id: searchParams.get("course_id") ?? "",
    instructor_id: searchParams.get("instructor_id") ?? "",
    location_id: searchParams.get("location_id") ?? "",
  };

  const [filters, setFilters] = useState(initialFromUrl);
  const [appliedFilters, setAppliedFilters] = useState(initialFromUrl);
  const [page, setPage] = useState(1);

  // SINGLE API call for the whole page — Schedule and the sidebar both read
  // from this one response, instead of each fetching independently.
  const { data, isLoading } = useGetCourseSchedule(TRAINING_SITE_ID, {
    ...appliedFilters,
    page,
  });

  const settings = data?.data?.settings;

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
        />
      </div>

      {/* ── Sidebar ── */}
      <div className="w-full lg:max-w-[300px] shrink-0">
        <div className="flex flex-col gap-4">
          {/* Secure Site */}
          <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-2 border-b border-gray-200 dark:border-zinc-700">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Secure Site</h3>
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
          {settings && settings.length !== 0  && (
            <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-2 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Contact Us</h3>
              </div>
              <div className="px-4 py-3 flex flex-col gap-0.5 text-sm">
                {settings.company_name && (
                  <p className="font-semibold text-gray-900 dark:text-white">{settings.company_name}</p>
                )}
                {settings.tag_line && (
                  <p className="font-semibold text-gray-700 dark:text-zinc-300">{settings.tag_line}</p>
                )}
                <div className="text-gray-600 dark:text-zinc-400 mt-1 text-xs leading-5">
                  {settings.address_1 && <p>{settings.address_1}</p>}
                  {settings.address_2 && <p>{settings.address_2}</p>}
                  {(settings.city || settings.state || settings.zip_code) && (
                    <p>{[settings.city, settings.state, settings.zip_code].filter(Boolean).join(", ")}</p>
                  )}
                  {settings.phone && <p className="mt-1">{settings.phone}</p>}
                  {settings.email_address && (
                    <a href={`mailto:${settings.email_address}`} className="text-blue-600 hover:underline break-all">
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
                className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed
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