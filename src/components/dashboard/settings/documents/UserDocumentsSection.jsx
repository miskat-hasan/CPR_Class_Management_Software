// src/components/dashboard/settings/documents/UserDocumentsSection.jsx
"use client";

import { useState } from "react";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  useGetUserDocuments,
  useDeleteUserDocument,
} from "@/hooks/api/dashboardApi";
import { useQueryClient } from "@tanstack/react-query";
import { HiOutlineDownload, HiOutlineTrash } from "react-icons/hi";
import { toast } from "sonner";
import {
  Table,
  TableBodyRow,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";
import useAuth from "@/hooks/useAuth";
import UploadUserDocumentModal from "./UploadUserDocumentModal";

const UserDocumentsSection = ({ userId, title = "Documents" }) => {
  const [perPage, setPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();

  const { activeRole } = useAuth();

  const { data: documentsData, isLoading: documentsLoading } =
    useGetUserDocuments({
      userId,
      perPage,
    });

  const { mutate: deleteDocument, isPending } = useDeleteUserDocument();

  const handleDelete = id => {
    deleteDocument(
      { endpoint: `/api/user-documents/${id}` },
      {
        onSuccess: data => {
          queryClient.invalidateQueries({
            queryKey: ["user-documents", userId, perPage],
          });
          toast.success(data?.message || "Document deleted successfully");
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {documentsLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="flex justify-between border-b dark:border-gray-700 pb-3">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              {title}
            </h2>
            {(activeRole.role_name === "Super Admin" ||
              title === "My Documents") && (
              <Button
                onClick={() => setOpenModal(true)}
                className="py-[11px] lg:py-[18px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
              >
                Upload Document
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap text-left font-medium">
                    Name
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap text-left font-medium">
                    File
                  </th>
                  <th className="px-3 md:px-6 py-3 text-right whitespace-nowrap font-medium">
                    Action
                  </th>
                </tr>
              </TableHead>
              <tbody>
                {documentsData?.data?.data?.length > 0 ? (
                  documentsData?.data?.data?.map((item, index) => (
                    <TableBodyRow key={index}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.document_name ?? "--"}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.document_path?.split("/").pop() ??
                          item.document_url?.split("/").pop() ??
                          "--"}
                      </td>
                      <td className="px-3 md:px-6 py-4 flex gap-2.5 justify-end items-center">
                        <a
                          href={item.document_url}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="p-1.5 sm:p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#6b6c6d] dark:hover:bg-[#292b2c] rounded-lg hover:bg-gray-200 transition cursor-pointer inline-flex"
                        >
                          <HiOutlineDownload className="text-gray-600 dark:text-gray text-[16px]" />
                        </a>
                        {activeRole.role_name === "Super Admin" && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isPending}
                            className="p-1.5 sm:p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#6b6c6d] dark:hover:bg-[#7a2828] rounded-lg hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
                          >
                            <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px] hover:text-red-600" />
                          </button>
                        )}
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <TableFooter
            Links={documentsData?.data?.links}
            perPage={perPage}
            setPage={() => {}}
            setPerPage={setPerPage}
          />
        </div>
      )}

      <UploadUserDocumentModal
        open={openModal}
        onOpenChange={setOpenModal}
        userId={userId}
      />
    </section>
  );
};

export default UserDocumentsSection;
