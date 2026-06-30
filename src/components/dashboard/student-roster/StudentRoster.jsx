// src/components/dashboard/student_roster/StudentRoster.jsx
"use client";

import BackButton from "@/components/common/BackButton";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableHead,
} from "@/components/common/TableElement";
import {
  useDownloadRoster,
  useDownloadStudentListPDF,
  useFinalizeRoster,
  useGetStudentByClassId,
} from "@/hooks/api/dashboardApi";
import Link from "next/link";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import AddStudentModal from "./AddStudentModal";

const StudentRoster = ({ id }) => {
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);

  const { data: studentData, isLoading: studentDataLoading } =
    useGetStudentByClassId(id);

  const { mutate: finalizeRosterMutation, isPending: finalizeRosterPending } =
    useFinalizeRoster();

  const { mutate: downloadRoster, isPending: downloadRosterPending } =
    useDownloadRoster(id);

  const handleDownloadRoster = () => {
    downloadRoster(
      { id },
      {
        onSuccess: blob => {
          const file = new Blob([blob], { type: "application/pdf" });
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

  const { mutate: downloadStudentList, isPending: downloadStudentListPending } =
    useDownloadStudentListPDF();

  const handleDownloadStudentList = () => {
    downloadStudentList(
      { class_details_id: id },
      {
        onSuccess: blob => {
          const file = new Blob([blob], { type: "application/pdf" });
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

  const isFinalized = studentData?.data?.students?.some(
    item => item.is_finalized === 1,
  );

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SubSectionTitle subtitle="Student Lists" />

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        {/* Top action buttons */}
        <div className="flex sm:justify-end flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => setOpenAddStudentModal(true)}
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none"
          >
            Quick Add
          </Button>
          <Button
            asChild
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none"
          >
            <Link href={`${id}/add-student`}>Add Student</Link>
          </Button>
        </div>

        {/* Table */}
        {studentDataLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 sm:px-6 py-3">Student</th>
                  <th className="px-3 sm:px-6 py-3">Status</th>
                  <th className="px-3 sm:px-6 py-3">Codes</th>
                  <th className="px-3 sm:px-6 py-3">Phone</th>
                  <th className="px-3 sm:px-6 py-3">Due</th>
                  <th className="px-3 sm:px-6 py-3 text-center">Action</th>
                </tr>
              </TableHead>
              <tbody>
                {studentData?.data?.students?.length > 0 ? (
                  studentData.data.students.map(item => (
                    <TableBodyRow key={item?.id}>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <p className="font-medium dark:text-white">
                          {item?.first_name} {item?.last_name}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {item?.email}
                        </p>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item?.status}
                      </td>
                      <td className="px-3 sm:px-6 py-3 truncate max-w-[160px] sm:max-w-[220px]">
                        {item?.code}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-nowrap">
                        {item?.primary_phone}
                      </td>
                      <td className="px-3 sm:px-6 py-3">
                        ${item?.payable_amount}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <TableButton href={`${id}/edit-student/${item.id}`}>
                            <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                          </TableButton>
                        </div>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* Footer action buttons */}
        {studentData?.data?.students?.length > 0 && (
          
        <div className="flex sm:justify-end flex-wrap gap-2">
          <BackButton />
          <Button
            asChild
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none"
          >
            <Link href={`${id}/send-communication`}>Send Communication</Link>
          </Button>
          <Button
            asChild
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none"
          >
            <Link href={`${id}/edit-score`}>Edit Scores</Link>
          </Button>
          {isFinalized ? (
            <Button
              onClick={handleDownloadRoster}
              disabled={downloadRosterPending}
              className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-60"
            >
              {downloadRosterPending ? "Downloading..." : "View Roster"}
            </Button>
          ) : (
            <Button
              onClick={() => finalizeRosterMutation({ course_id: id })}
              disabled={finalizeRosterPending}
              className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-60"
            >
              {finalizeRosterPending ? "Processing..." : "Finalized Roster"}
            </Button>
          )}
          <Button
            onClick={handleDownloadStudentList}
            disabled={downloadStudentListPending}
            className="h-8 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-60"
          >
            {downloadStudentListPending ? "Downloading..." : "Student List"}
          </Button>
        </div>
        )}
      </div>

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
