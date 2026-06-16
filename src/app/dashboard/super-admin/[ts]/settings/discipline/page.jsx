"use client";

import { useState } from "react";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import ConfirmModal from "@/components/common/ConfirmModal";
import DisciplineModal from "@/components/dashboard/settings/discipline/DisciplineModal";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
  TableFooter,
} from "@/components/common/TableElement";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import { getAllDiscipline, deleteDiscipline } from "@/hooks/api/dashboardApi";
import { HiOutlineTrash } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";

export default function DisciplinePage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, refetch } = getAllDiscipline(page, perPage);
  const { mutate: deleteMutate, isPending: isDeleting } = deleteDiscipline();

  const handleOpenAdd = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = item => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const handleConfirmDelete = () => {
    deleteMutate(
      { endpoint: `/api/discipline/delete?id=${deleteTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Discipline deleted successfully");
          setDeleteTarget(null);
          refetch();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
          setDeleteTarget(null);
        },
      },
    );
  };

  return (
    <>
      <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
        <div className="flex justify-between">
          <SectionTitle title="Disciplines" />
          <Button
            onClick={handleOpenAdd}
            className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
          >
            Add Discipline
            <PlusIcon />
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
                      Name
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
                        <td className="px-3 md:px-6 py-4 text-sm font-medium">
                          {item.name}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <TableButton
                              isLink={false}
                              type="button"
                              onClick={() => handleOpenEdit(item)}
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
                        colSpan="3"
                        className="text-center py-6 text-gray-500 italic text-sm"
                      >
                        No results found
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

      <DisciplineModal
        open={showModal}
        onClose={handleCloseModal}
        onSuccess={refetch}
        editItem={editItem}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this discipline?"
        description={`"${deleteTarget?.name}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isDeleting}
      />
    </>
  );
}
