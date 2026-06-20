"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/ConfirmModal";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
  TableFooter,
} from "@/components/common/TableElement";
import { Button } from "@/components/ui/button";
import { deleteClass, bulkDeleteClasses } from "@/hooks/api/dashboardApi";
import { CiEdit } from "react-icons/ci";
import { GoArrowUpRight } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";

export default function ClassTable({
  data,
  isLoading,
  links,
  setPage,
  basePath,
  onRefetch,
}) {
  const { ts } = useParams();

  const [selected, setSelected] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const { mutate: deleteMutate, isPending: isDeleting } = deleteClass();
  const { mutate: bulkDeleteMutate, isPending: isBulkDeleting } =
    bulkDeleteClasses();

  const allIds = (data ?? []).map(item => item.id);
  const allSelected =
    allIds.length > 0 && allIds.every(id => selected.includes(id));

  const toggleAll = () => {
    setSelected(allSelected ? [] : allIds);
  };

  const toggleOne = id => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const handleConfirmDelete = () => {
    deleteMutate(
      { endpoint: `/api/class/delete?id=${deleteTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Class deleted");
          setDeleteTarget(null);
          onRefetch?.();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Delete failed");
          setDeleteTarget(null);
        },
      },
    );
  };

  const handleBulkDelete = () => {
    const formData = new FormData();
    selected.forEach(id => formData.append("ids[]", id));

    bulkDeleteMutate(formData, {
      onSuccess: res => {
        toast.success(res?.message || "Classes deleted");
        setSelected([]);
        setShowBulkModal(false);
        onRefetch?.();
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Bulk delete failed");
        setShowBulkModal(false);
      },
    });
  };

  return (
    <>
      {/* Bulk actions bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-brown/10 dark:bg-dark-brown/10 border border-brown/20 rounded-md">
          <span className="text-sm text-brown font-medium">
            {selected.length} selected
          </span>
          <Button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer"
          >
            Delete selected
          </Button>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <tr>
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-brown cursor-pointer"
                  />
                </th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                  Class ID
                </th>
                <th className="px-3 sm:px-6 py-3">Instructor</th>
                <th className="px-3 sm:px-6 py-3">Date/Time</th>
                <th className="px-3 sm:px-6 py-3">Course</th>
                <th className="px-3 sm:px-6 py-3">Location</th>
                <th className="px-3 sm:px-6 py-3">Enrolled</th>
                <th className="px-3 sm:px-6 py-3 text-center">Action</th>
              </tr>
            </TableHead>
            <tbody>
              {(data ?? []).length > 0 ? (
                (data ?? []).map(item => (
                  <TableBodyRow key={item.id}>
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleOne(item.id)}
                        className="accent-brown cursor-pointer"
                      />
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm">
                      {item.class_id ?? item.id}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm whitespace-nowrap">
                      {item.instructor_name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm whitespace-nowrap">
                      {item.date_time?.[0]?.date ?? "—"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm truncate max-w-[160px]">
                      {item?.course_name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm truncate max-w-[140px]">
                      {item.location_name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm">
                      {item.enrollments_count ?? "0"}/{item.max_student}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <TableButton
                          href={`/dashboard/super-admin/${ts}/class-and-students/${basePath}/${item.id}`}
                        >
                          <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                        </TableButton>
                        {/* <TableButton
                          href={`/dashboard/super-admin/${ts}/class-and-students/${basePath}/${item.id}/roster`}
                        >
                          <GoArrowUpRight className="text-gray-600 dark:text-gray text-[16px]" />
                        </TableButton> */}
                        <TableButton
                          isLink={false}
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px]" />
                        </TableButton>
                      </div>
                    </td>
                  </TableBodyRow>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-400 italic text-sm"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <TableFooter
        Links={links}
        setPage={setPage}
        perPage={10}
        setPerPage={() => {}}
      />

      {/* Delete single */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this class?"
        description={`Class #${deleteTarget?.class_id ?? deleteTarget?.id} will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isDeleting}
      />

      {/* Bulk delete */}
      <ConfirmModal
        open={showBulkModal}
        title={`Delete ${selected.length} classes?`}
        description="All selected classes will be permanently deleted."
        confirmLabel="Delete All"
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkModal(false)}
        isPending={isBulkDeleting}
      />
    </>
  );
}
