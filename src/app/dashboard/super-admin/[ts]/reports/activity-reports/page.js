"use client";

import React from "react";
import { Download, Loader2 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import {
  useExportClassByStudentPDF,
  useExportInstructorByDisciplinePDF,
  useExportStudentDiscipline,
  useGetClassAndStudentByDiscipline,
  useGetClassAndStudentReport,
  useGetInstructorByDiscipline,
} from "@/hooks/api/dashboardApi";

export default function ActivityReportPage() {
  /* ---------------- Skeleton ---------------- */
  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );

  /* ---------------- API ---------------- */

  const {
    data: instructorByDisciplineData,
    isLoading: instructorByDisciplineDataLoading,
  } = useGetInstructorByDiscipline();

  const {
    data: classAndStudentReport,
    isLoading: classAndStudentReportLoading,
  } = useGetClassAndStudentReport();

  const {
    data: classAndStudentByDiscipline,
    isLoading: classAndStudentByDisciplineLoading,
  } = useGetClassAndStudentByDiscipline();

  /* ---------------- EXPORTS ---------------- */

  const {
    mutate: instructorByDisciplinePDFMutation,
    isPending: instructorByDisciplinePDFPending,
  } = useExportInstructorByDisciplinePDF();

  const handleInstructorByDisciplineExcel = (slug) => {
    instructorByDisciplinePDFMutation(slug, {
      onSuccess: (blob) => {
        const file = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "instructors-by-discipline.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
      },
    });
  };

  const {
    mutate: classByStudentPDFDownloadMutation,
    isPending: classByStudentPDFDownloadPending,
  } = useExportClassByStudentPDF();

  const handleClassByStudentPDF = (slug) => {
    classByStudentPDFDownloadMutation(slug, {
      onSuccess: (blob) => {
        const file = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "class-by-student.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
      },
    });
  };

  const {
    mutate: exportStudentDisciplineMutation,
    isPending: exportStudentDisciplinePending,
  } = useExportStudentDiscipline();

  const handleExportStudentDiscipline = (slug) => {
    exportStudentDisciplineMutation(slug, {
      onSuccess: (blob) => {
        const file = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "discipline-by-student.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
      },
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen space-y-2.5 lg:space-y-5">
      <SectionTitle title={"Activity Report"} />

      <div className="space-y-3 lg:space-y-6">

        {/* ================= Instructor by Discipline ================= */}
        <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              Instructor by Discipline
            </h2>

            <button
              onClick={() =>
                handleInstructorByDisciplineExcel("instructor-by-discipline")
              }
              disabled={instructorByDisciplinePDFPending}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {instructorByDisciplinePDFPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 pb-2 border-b text-sm font-semibold text-gray-500">
              <span>Discipline</span>
              <span className="text-right">Instructors</span>
            </div>

            <div className="mt-2 space-y-3">
              {instructorByDisciplineDataLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </div>
                  ))
                : instructorByDisciplineData?.data?.disciplines?.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 py-2 border-b last:border-0"
                      >
                        <span>{item?.name}</span>
                        <span className="text-right">
                          {item?.instructors}
                        </span>
                      </div>
                    )
                  )}
            </div>
          </div>
        </div>

        {/* ================= Classes & Students ================= */}
        <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              Classes and Students
            </h2>

            <button
              onClick={() => handleClassByStudentPDF("Class-by-student")}
              disabled={classByStudentPDFDownloadPending}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {classByStudentPDFDownloadPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 pb-2 border-b text-sm font-semibold text-gray-500">
              <span>Course Type</span>
              <span className="text-center">Classes</span>
              <span className="text-right">Students</span>
            </div>

            <div className="mt-2 space-y-3">
              {classAndStudentReportLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-10 mx-auto" />
                      <Skeleton className="h-4 w-10 ml-auto" />
                    </div>
                  ))
                : classAndStudentReport?.data?.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 py-2 border-b last:border-0"
                    >
                      <span>{item?.course_type}</span>
                      <span className="text-center">
                        {item?.classes}
                      </span>
                      <span className="text-right">
                        {item?.students}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* ================= Discipline Report ================= */}
        <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              Classes and Students by Discipline
            </h2>

            <button
              onClick={() =>
                handleExportStudentDiscipline("student-by-discipline")
              }
              disabled={exportStudentDisciplinePending}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {exportStudentDisciplinePending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 pb-2 border-b text-sm font-semibold text-gray-500">
              <span>Discipline</span>
              <span className="text-center">Classes</span>
              <span className="text-right">Students</span>
            </div>

            <div className="mt-2 space-y-3">
              {classAndStudentByDisciplineLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-10 mx-auto" />
                      <Skeleton className="h-4 w-10 ml-auto" />
                    </div>
                  ))
                : classAndStudentByDiscipline?.data?.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 py-2 border-b last:border-0"
                      >
                        <span>{item?.discipline}</span>
                        <span className="text-center">
                          {item?.classes}
                        </span>
                        <span className="text-right">
                          {item?.students}
                        </span>
                      </div>
                    )
                  )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}