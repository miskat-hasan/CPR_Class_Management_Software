// src/components/enrollment/SchedulePageContent.js
"use client";

import { useSearchParams } from "next/navigation";
import { useGetCourseSchedule } from "@/hooks/api/dashboardApi";
import EnrollSidebar from "@/components/enrollment/EnrollSidebar";
import Schedule from "@/components/enrollment/Schedule";

export default function SchedulePageContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");

  const { data, isLoading } = useGetCourseSchedule(courseId);

  const settings = data?.data?.settings;

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-zinc-700">
          Class Schedule
        </h1>
        {settings?.schedule_page_text_html && (
          <div
            className="prose prose-sm prose-slate text-dark dark:text-white dark:prose-invert max-w-none text-xs leading-relaxed
[&_ol]:list-decimal [&_ol]:pl-5
[&_li[data-list=bullet]]:list-disc [&_li[data-list=bullet]]:ml-6"
            dangerouslySetInnerHTML={{
              __html: settings.schedule_page_text_html
                ?.replace(/background-color:\s*[^;]+;?/g, "")
                ?.replace(/color:\s*[^;]+;?/g, ""),
            }}
          />
        )}
        <Schedule courses={data?.data?.courses} />
      </div>

      {/* right side */}
      <div className="w-full lg:max-w-[342px] shrink-0">
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
          {settings && (
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
                className="prose prose-sm prose-slate text-dark dark:text-white dark:prose-invert max-w-none text-[15px] leading-relaxed
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
