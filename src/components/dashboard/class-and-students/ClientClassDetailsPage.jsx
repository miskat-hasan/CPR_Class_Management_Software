// src/components/dashboard/class-and-students/ClientClassDetailsPage.jsx
"use client";

import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBodyRow,
  TableHead,
} from "@/components/common/TableElement";
import {
  getSingleClass,
  getSingleLocation,
  useGetStudentByClassId,
} from "@/hooks/api/dashboardApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DetailItem = ({ label, value }) => (
  <div>
    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
      {label}:
    </span>{" "}
    <span className="text-sm text-black dark:text-white">{value || "—"}</span>
  </div>
);

const formatDate = date => (date ? new Date(date).toLocaleDateString() : "—");

// ─── Component ────────────────────────────────────────────────────────────────
export default function ClientClassDetailsPage({ classId }) {
  const { data, isLoading } = getSingleClass(classId);
  const classData = data?.data;
  const course = classData?.course;
  const instructor = classData?.instructor;

  const { data: locationData } = getSingleLocation(classData?.location_id);
  const trainingAddress = [
    locationData?.data?.address_1,
    locationData?.data?.address_2,
    locationData?.data?.city,
    locationData?.data?.state,
    locationData?.data?.zip,
    locationData?.data?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const { data: studentData, isLoading: studentsLoading } =
    useGetStudentByClassId(classId);
  const students = studentData?.data?.students ?? [];

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
      <SectionTitle title="Course Details" />

      {/* ── Class info ── */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {/* Left column */}
          <div className="space-y-3">
            <DetailItem label="Course Name" value={course?.course_name} />
            <DetailItem
              label="Certifying Body"
              value={course?.certifying_body?.name}
            />
            <DetailItem label="Mode" value={course?.mode} />
            <DetailItem
              label="Location"
              value={trainingAddress || classData?.location_name}
            />
            <DetailItem label="Guidelines" value={classData?.guidelines} />
            <DetailItem label="Total Hours" value={classData?.total_hours} />
            <DetailItem
              label="Price"
              value={classData?.price ? `$${classData.price}` : "—"}
            />
          </div>

          {/* Right column */}
          <div className="space-y-3">
            <DetailItem label="Manikin Ratio" value={classData?.ratio} />
            <DetailItem label="Max Students" value={classData?.max_student} />
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
                  ? `${instructor.first_name} ${instructor.last_name}`
                  : "—"
              }
            />
            <DetailItem label="Instructor Email" value={instructor?.email} />
            <DetailItem
              label="Instructor Phone"
              value={instructor?.mobile_phone}
            />
          </div>
        </div>

        {/* Schedule */}
        {classData?.class_times?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Class Schedule:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-800 font-semibold text-black dark:text-white">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 whitespace-nowrap">Day</th>
                    <th className="px-4 py-3 whitespace-nowrap">From</th>
                    <th className="px-4 py-3 whitespace-nowrap">To</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.class_times.map((t, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {t.day ?? "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{t.from}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{t.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Description */}
        {course?.description && (
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Description:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {course.description}
            </p>
          </div>
        )}

        {/* Public notes */}
        {classData?.public_notes && (
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Notes:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {classData.public_notes}
            </p>
          </div>
        )}
      </div>

      {/* ── Enrolled students ── */}
      <SubSectionTitle subtitle="Enrolled Students" />
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        {studentsLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 sm:px-6 py-3">Student</th>
                  <th className="px-3 sm:px-6 py-3">Phone</th>
                  <th className="px-3 sm:px-6 py-3">Status</th>
                  <th className="px-3 sm:px-6 py-3">Amount Due</th>
                </tr>
              </TableHead>
              <tbody>
                {students.length > 0 ? (
                  students.map(student => (
                    <TableBodyRow key={student.id}>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <p className="font-medium dark:text-white">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {student.email}
                        </p>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm">
                        {student.primary_phone ?? "—"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm">
                        {student.status ?? "—"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm">
                        {student.payable_amount != null
                          ? `$${student.payable_amount}`
                          : "—"}
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-400 italic text-sm"
                    >
                      No students enrolled yet
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        <div className="flex justify-end border-t dark:border-gray-700 pt-4">
          <BackButton />
        </div>
      </div>
    </div>
  );
}
