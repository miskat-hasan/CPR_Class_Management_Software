// src/components/dashboard/Instructors/DocumentList.jsx
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBodyRow,
  TableHead,
} from "@/components/common/TableElement";
import FormContainer from "@/components/shared/form/FormContainer";
import { Button } from "@/components/ui/button";
import { deleteDocument, storeDocument } from "@/hooks/api/dashboardApi";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DocumentList = ({ instructorId, documentData, isLoading }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const form = useForm({
    defaultValues: {},
  });

  const { reset, watch, register } = form;

  const {
    mutateAsync: storeDocumentMutation,
    isPending: storeDocumentLoading,
  } = storeDocument();

  const documentPathWatch = watch("documentFile");

  const queryClient = useQueryClient();

  const documentOnSubmit = data => {
    const formData = new FormData();
    formData.append("instructor_id", instructorId);
    if (data.documentFile?.[0]) {
      formData.append("document_path", data.documentFile[0]);
    }

    storeDocumentMutation(formData, {
      onSuccess: data => {
        toast.success(data?.message || "Document added successfully");
        reset();
        queryClient.invalidateQueries("get-single-instructor");
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  const { mutate: deleteDocumentMutation, isPending: deleteDocumentPending } =
    deleteDocument();

  const handleDelete = id => {
    setSelectedItem(id);
    deleteDocumentMutation({ endpoint: `/api/documents/delete?id=${id}` });
  };

  return (
    <div className="mt-8 flex flex-col gap-[12.5px] lg:gap-[25px]">
      <FormContainer form={form} onSubmit={documentOnSubmit}>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle title={"Documents"} />
          <label className="py-[7px] cursor-pointer rounded-sm text-white px-3 text-sm bg-brown dark:bg-dark-brown flex items-center gap-2">
            <input
              {...register("documentFile")}
              type="file"
              className="hidden"
            />
            Add Document
            <PlusIcon size={16} />
          </label>
        </div>

        {isLoading ? (
          <TableSkeleton columns={2} rows={2} />
        ) : (
          <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <tr>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Filename
                    </th>
                    <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </TableHead>

                <tbody>
                  {documentPathWatch?.[0]?.name && (
                    <TableBodyRow>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {documentPathWatch[0].name}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            type="button"
                            onClick={() => reset()}
                            className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-700 dark:text-gray hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={storeDocumentLoading}
                            className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {storeDocumentLoading ? "Saving ..." : "Save"}
                          </Button>
                        </div>
                      </td>
                    </TableBodyRow>
                  )}

                  {documentData?.length > 0 ? (
                    documentData.map(item => (
                      <TableBodyRow key={item.id}>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          {item.document_path}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <button
                              type="button"
                              className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                              <Download
                                size={16}
                                className="text-gray-600 dark:text-gray"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item?.id)}
                              disabled={deleteDocumentPending}
                              className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer inline-block hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {deleteDocumentPending &&
                              selectedItem === item?.id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin text-gray-600 dark:text-gray"
                                />
                              ) : (
                                <Trash2
                                  size={16}
                                  className="text-gray-600 dark:text-gray"
                                />
                              )}
                            </button>
                          </div>
                        </td>
                      </TableBodyRow>
                    ))
                  ) : !documentPathWatch?.[0]?.name ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        No results found
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </FormContainer>
    </div>
  );
};

export default DocumentList;
