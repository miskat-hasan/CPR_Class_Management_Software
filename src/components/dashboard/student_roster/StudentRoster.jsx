// src/components/dashboard/student_roster/StudentRoster.jsx
"use client";

import BackButton from "@/components/common/BackButton";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  useDownloadRoster,
  useDownloadStudentListPDF,
  useFinalizeRoster,
  useGetStudentByClassId,
} from "@/hooks/api/dashboardApi";
import Link from "next/link";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import AddStudentModal from "../AddStudentModal";

const StudentRoster = ({ id }) => {
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);

  // get student data
  const { data: studentData, isLoading: studentDataLoading } =
    useGetStudentByClassId(id);

  const { mutate: finalizeRosterMutation, isPending: finalizeRosterPending } =
    useFinalizeRoster();

  // student roster download
  const { mutate: downloadRoster, isPending: downloadRosterPending } =
    useDownloadRoster(id);

  const handleDownloadRoster = () => {
    downloadRoster(
      { id },
      {
        onSuccess: blob => {
          const file = new Blob([blob], {
            type: "application/pdf",
          });

          const url = window.URL.createObjectURL(file);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "student-roster.pdf");

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(url);
        },
      },
    );
  };

  // student list download
  const { mutate: downloadStudentList, isPending: downloadStudentListPending } =
    useDownloadStudentListPDF();

  const handleDownloadStudentList = () => {
    downloadStudentList(
      { class_details_id: id },
      {
        onSuccess: blob => {
          const file = new Blob([blob], {
            type: "application/pdf",
          });

          const url = window.URL.createObjectURL(file);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "student-list.pdf");

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(url);
        },
      },
    );
  };
  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SubSectionTitle subtitle="Student Lists" />
      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <div className="flex sm:justify-end flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => setOpenAddStudentModal(true)}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none"
          >
            Quick Add
          </Button>
          <Button
            asChild
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none"
          >
            <Link href={`${id}/add-student`}>Add Student</Link>
          </Button>
        </div>

        {studentDataLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full  text-sm sm:text-base text-left text-gray-700 min-w-[800px]">
              <thead className="bg-gray-50 text-black capitalize text-[16px] sm:text-[18px] font-semibold">
                <tr>
                  <th className="px-3 sm:px-6 py-3">Student</th>
                  <th className="px-3 sm:px-6 py-3">Status</th>
                  <th className="px-3 sm:px-6 py-3">Codes</th>
                  <th className="px-3 sm:px-6 py-3">Phone</th>
                  <th className="px-3 sm:px-6 py-3">Due</th>
                  <th className="px-3 sm:px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {studentData?.data?.students?.length > 0 ? (
                  studentData?.data?.students?.map(item => (
                    <tr
                      key={item?.id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <p className="font-medium">
                          {item?.first_name} {item?.last_name}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {item?.email}
                        </p>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-800 whitespace-nowrap">
                        {item?.status}
                      </td>

                      <td className="px-3 sm:px-6 py-3 truncate max-w-[160px] sm:max-w-[220px]">
                        {item?.code}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-600 text-nowrap">
                        {item?.primary_phone}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-600">
                        ${item?.payable_amount}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center space-x-2">
                        <Link href={`student/${item.id}`}>
                          <button className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                            <CiEdit className="text-gray-600 text-[14px] sm:text-[16px]" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Footer Buttons */}
        <div className="flex sm:justify-end flex-wrap gap-2">
          <Button
            asChild
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none"
          >
            <Link href={`${id}/send-communication`}>Send Communication</Link>
          </Button>
          <Button
            asChild
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none"
          >
            <Link href={`${id}/edit-score`}>Edit Scores</Link>
          </Button>
          {studentData?.data?.students?.find(
            item => item.is_finalized === 1,
          ) ? (
            <Button
              onClick={() => handleDownloadRoster()}
              disabled={downloadRosterPending}
              className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none disabled:opacity-60"
            >
              {downloadRosterPending ? "Downloading..." : "View Roster"}
            </Button>
          ) : (
            <Button
              onClick={() => finalizeRosterMutation({ course_id: id })}
              disabled={finalizeRosterPending}
              className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none disabled:opacity-60"
            >
              {finalizeRosterPending ? "Processing..." : "Finalized Roster"}
            </Button>
          )}
          <Button
            onClick={() => handleDownloadStudentList()}
            disabled={downloadStudentListPending}
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none disabled:opacity-60"
          >
            {downloadStudentListPending ? "Downloading..." : "Student List"}
          </Button>
        </div>
      </div>

      {/* add student modal */}
      {openAddStudentModal && (
        <AddStudentModal
          classId={id}
          open={openAddStudentModal}
          onClose={() => setOpenAddStudentModal(false)}
        />
      )}
    </div>
  );
};

export default StudentRoster;
