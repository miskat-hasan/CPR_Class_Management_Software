// src/components/dashboard/settings/certificates/DocumentsSection.jsx
"use client";

import TableSkeleton from "@/components/skeleton/TableSkeleton";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import { Button } from "@/components/ui/button";
import {
  deleteSingleCertificationFile,
  downloadCertificationFile,
  getAllCertificationFile,
} from "@/hooks/api/dashboardApi";
import { useQueryClient } from "@tanstack/react-query";

import React, { useState } from "react";

import { HiOutlineDownload } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { toast } from "sonner";
import {
  Table,
  TableBodyRow,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";
import useAuth from "@/hooks/useAuth";
import UploadDocumentModal from "./UploadDocumentModal";

const DocumentsSection = () => {
  const { activeRole } = useAuth();

  const [page, setPage] = useSiteAwarePagination();
  const [perPage, setPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);

  // get all certification file
  const {
    data: certificationFileData,
    isLoading: certificationFileDataLoading,
  } = getAllCertificationFile(page, perPage);

  // delete a single certification file
  const {
    mutate: deleteCertificationFileMutation,
    isPending: deleteCertificationFilePending,
  } = deleteSingleCertificationFile(selectedFileId);

  const queryClient = useQueryClient();
  // delete a single certification file
  const handleDeleteCertificationFile = id => {
    setSelectedFileId(id);

    deleteCertificationFileMutation(id, {
      onSuccess: data => {
        setSelectedFileId(null);
        queryClient.invalidateQueries("get-all-certification-file");
        toast.success(data?.message || "Certification deleted successfully");
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  // download certification api
  const {
    mutate: downloadCertificationFileMutation,
    isPending: downloadCertificationFilePending,
  } = downloadCertificationFile();

  const handleDownloadCertificationFile = id => {
    downloadCertificationFileMutation(
      { id },
      {
        onSuccess: blob => {
          const file = new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `certificate.docx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Table */}
      {certificationFileDataLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          {/* Header */}
          <div className="flex justify-between border-b dark:border-gray-700 pb-3">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              My Certificates
            </h2>
            <Button
              onClick={() => setOpenModal(true)}
              className="py-[11px] lg:py-[18px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
            >
              Upload Certificate
            </Button>
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
                {certificationFileData?.data?.length > 0 ? (
                  certificationFileData?.data?.map(item => (
                    <TableBodyRow key={item.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.name ?? "--"}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.file.split("/").pop()}
                      </td>

                      <td className="px-3 md:px-6 py-4 flex gap-2.5 justify-end items-center">
                        <button
                          onClick={() =>
                            handleDownloadCertificationFile(item?.id)
                          }
                          className="p-1.5 sm:p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#6b6c6d] dark:hover:bg-[#292b2c] rounded-lg hover:bg-gray-200 transition cursor-pointer"
                        >
                          <HiOutlineDownload className="text-gray-600 dark:text-gray text-[16px]" />
                        </button>
                        {activeRole?.role_name === "Super Admin" && (
                          <button
                            onClick={() =>
                              handleDeleteCertificationFile(item.id)
                            }
                            className="p-1.5 sm:p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#6b6c6d] dark:hover:bg-[#7a2828] rounded-lg hover:bg-gray-200 transition cursor-pointer"
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

          {/* Footer controls */}
          <TableFooter
            Links={certificationFileData?.links}
            perPage={perPage}
            setPage={setPage}
            setPerPage={setPerPage}
          />
        </div>
      )}
      <UploadDocumentModal open={openModal} onOpenChange={setOpenModal} />
    </section>
  );
};

export default DocumentsSection;
