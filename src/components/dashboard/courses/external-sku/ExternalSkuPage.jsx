"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import ConfirmModal from "@/components/common/ConfirmModal";
import AddExternalSKUModal from "@/components/dashboard/courses/external-sku/AddExternalSKUModal";
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
  getAllExternalSKU,
  deleteSingleExternalSKU,
} from "@/hooks/api/dashboardApi";
import { HiOutlineTrash } from "react-icons/hi";

const formatDate = iso => {
  if (!iso) return "---";
  return new Date(iso).toLocaleDateString();
};

export default function ExternalSkuPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: externalSkuData,
    isLoading,
    refetch,
  } = getAllExternalSKU(page, perPage);
  const { mutate: deleteMutate, isPending: isDeleting } =
    deleteSingleExternalSKU();

  const handleConfirmDelete = () => {
    deleteMutate(
      { endpoint: `/api/external_sku/delete?id=${deleteTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "External SKU deleted successfully");
          setDeleteTarget(null);
          queryClient.invalidateQueries(["get-all-external-sku"]);
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
          <SectionTitle title="External SKU" />
          <Button
            onClick={() => setShowAddModal(true)}
            className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
          >
            Add External SKU
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
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Create Date
                    </th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Code
                    </th>
                    <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </TableHead>
                <tbody>
                  {externalSkuData?.data?.data?.length > 0 ? (
                    externalSkuData.data.data.map(item => (
                      <TableBodyRow key={item.id}>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-sm">
                          {item.name}
                        </td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">
                          {item.code}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-center">
                          <TableButton
                            isLink={false}
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px]" />
                          </TableButton>
                        </td>
                      </TableBodyRow>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
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
              Links={externalSkuData?.data?.links}
              perPage={perPage}
              setPage={setPage}
              setPerPage={setPerPage}
            />
          </div>
        )}
      </section>

      <AddExternalSKUModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={refetch}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this External SKU?"
        description={`"${deleteTarget?.name}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isDeleting}
      />
    </>
  );
}
