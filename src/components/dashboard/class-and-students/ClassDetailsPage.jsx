// src/components/dashboard/class-and-students/ClassDetailsPage.jsx
"use client";

import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import { getSingleClass } from "@/hooks/api/dashboardApi";

const DetailItem = ({ label, value }) => (
  <div>
    <span className="leading-[1.45] font-medium text-base text-gray-700 dark:text-gray-300">
      {label}:
    </span>{" "}
    <span className="text-sm text-black dark:text-white">{value || "-"}</span>
  </div>
);

const formatDate = date => (date ? new Date(date).toLocaleDateString() : "-");

const formatTime = time => {
  if (!time) return "-";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

export default function ClassDetailsPage({ classId }) {
  const { data, isLoading } = getSingleClass(classId);

  const classData = data?.data;
  const course = classData?.course;
  const instructor = classData?.instructor;

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="Class Details" />
        <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-brown rounded-full animate-spin" />
            <span className="text-sm">Loading class data…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-[10px] lg:gap-[20px]">
      <SectionTitle title={"Course Details"} />

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        {/* Course + Class Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
          <div className="space-y-3">
            <DetailItem label="Course Name" value={course?.course_name} />
            <DetailItem
              label="Certifying Body"
              value={course?.certifying_body?.name}
            />
            <DetailItem label="Mode" value={course?.mode} />
            <DetailItem label="Location" value={classData?.location_name} />
            <DetailItem label="Guidelines" value={classData?.guidelines} />
            <DetailItem label="Total Hours" value={classData?.total_hours} />
            <DetailItem label="Price" value={`$${classData?.price}`} />
            {classData?.reschedule_price && (
              <DetailItem
                label="Reschedule Price"
                value={`$${classData?.reschedule_price}`}
              />
            )}
          </div>

          <div className="space-y-3">
            <DetailItem label="Manikin Ratio" value={classData?.ratio} />
            <DetailItem
              label="Certificate Issued"
              value={formatDate(classData?.certificate_issued)}
            />
            <DetailItem
              label="Certificate Expires"
              value={formatDate(classData?.certificate_expire)}
            />
            <DetailItem
              label="Instructor"
              value={
                instructor
                  ? `${instructor?.first_name} ${instructor?.last_name}`
                  : "-"
              }
            />
            <DetailItem label="Instructor Email" value={instructor?.email} />
            <DetailItem
              label="Instructor Phone"
              value={instructor?.mobile_phone}
            />
          </div>
        </div>

        {/* Class Schedule */}
        <div className="overflow-x-auto">
          <p className="leading-[1.45] font-medium text-base text-gray-700 dark:text-gray-300 mb-2">
            Class Schedule:
          </p>
          <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800 text-black dark:text-white text-[14px] md:text-[16px] font-semibold">
              <tr>
                <th className="px-3 md:px-6 py-3 whitespace-nowrap">Date</th>
                <th className="px-3 md:px-6 py-3 whitespace-nowrap">From</th>
                <th className="px-3 md:px-6 py-3 whitespace-nowrap">To</th>
              </tr>
            </thead>
            <tbody>
              {classData?.class_times?.map((time, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    {formatDate(time?.date)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    {formatTime(time?.from)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    {formatTime(time?.to)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Description */}
        {course?.description && (
          <div>
            <p className="leading-[1.45] font-medium text-base text-gray-700 dark:text-gray-300 mb-1">
              Description:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {course?.description}
            </p>
          </div>
        )}

        {/* Notes */}
        {classData?.public_notes && (
          <div>
            <p className="leading-[1.45] font-medium text-base text-gray-700 dark:text-gray-300 mb-1">
              Notes:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {classData?.public_notes}
            </p>
          </div>
        )}

        {/* Back */}
        <div className="flex justify-end">
          <BackButton />
        </div>
      </div>
    </div>
  );
}
