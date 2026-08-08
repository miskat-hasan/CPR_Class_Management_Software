"use client";

import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  deleteSingleCertificationFile,
  downloadCertificationFile,
  getAllCertificationFile,
} from "@/hooks/api/dashboardApi";
import { useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { HiOutlineDownload } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import SectionTitle from "@/components/common/SectionTitle";
import {
  Table,
  TableBodyRow,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";
import Link from "next/link";

const Page = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const router = useRouter();

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
          console.log(file);
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
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Certificates"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
        >
          <Link href="certificates/upload">Upload Certificate</Link>
        </Button>
      </div>

      {/* Table */}
      {certificationFileDataLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap text-left">
                    Name/URL
                  </th>
                  <th className="px-3 md:px-6 py-3 text-right whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {certificationFileData?.data?.length > 0 ? (
                  certificationFileData?.data?.map(item => (
                    <TableBodyRow key={item.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {process.env.NEXT_PUBLIC_SITE_URL + "/" + item.file}
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
                        <button
                          onClick={() => handleDeleteCertificationFile(item.id)}
                          className="p-1.5 sm:p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#6b6c6d] dark:hover:bg-[#7a2828] rounded-lg hover:bg-gray-200 transition cursor-pointer"
                        >
                          <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px] hover:text-red-600" />
                        </button>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
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
    </section>
  );
};

export default Page;
