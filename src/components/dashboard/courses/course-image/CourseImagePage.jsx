"use client";

import { useState } from "react";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
  TableFooter,
} from "@/components/common/TableElement";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import {
  getAllCourseImages,
  deleteCourseImage,
} from "@/hooks/api/dashboardApi";
import { CiEdit } from "react-icons/ci";
import { HiOutlineTrash } from "react-icons/hi";
import Image from "next/image";
import CourseImageModal from "@/components/dashboard/courses/course-image/CourseImageModal";

export default function CourseImagePage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, refetch } = getAllCourseImages(page, perPage);
  const { mutate: deleteMutate, isPending: isDeleting } = deleteCourseImage();

  const handleConfirmDelete = () => {
    deleteMutate(
      { endpoint: `/api/course_image/delete?id=${deleteTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Deleted");
          setDeleteTarget(null);
          refetch();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Delete failed");
          setDeleteTarget(null);
        },
      },
    );
  };

  return (
    <>
      <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
        <div className="flex justify-between">
          <SectionTitle title="Course Images" />
          <Button
            onClick={() => {
              setEditItem(null);
              setShowModal(true);
            }}
            className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
          >
            Add Course Image <PlusIcon />
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <tr>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">#</th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Image
                    </th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Title
                    </th>
                    <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </TableHead>
                <tbody>
                  {data?.data?.data?.length > 0 ? (
                    data.data.data.map((item, index) => (
                      <TableBodyRow key={item.id}>
                        <td className="px-3 md:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 w-12">
                          {(page - 1) * perPage + index + 1}
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          {item.image ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item.image}`}
                              width={148}
                              height={48}
                              alt={item.title}
                              className="object-cover rounded border dark:border-gray-700"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">
                              No img
                            </div>
                          )}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-sm font-medium">
                          {item.title}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <TableButton
                              isLink={false}
                              type="button"
                              onClick={() => {
                                setEditItem(item);
                                setShowModal(true);
                              }}
                            >
                              <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                            </TableButton>
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
                        colSpan="4"
                        className="text-center py-6 text-gray-400 italic text-sm"
                      >
                        No course images found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <TableFooter
              Links={data?.data?.links}
              perPage={perPage}
              setPage={setPage}
              setPerPage={setPerPage}
            />
          </div>
        )}
      </section>

      <CourseImageModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditItem(null);
        }}
        onSuccess={refetch}
        editItem={editItem}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this course image?"
        description={`"${deleteTarget?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isDeleting}
      />
    </>
  );
}
