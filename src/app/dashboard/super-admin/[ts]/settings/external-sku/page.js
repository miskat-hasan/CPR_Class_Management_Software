"use client";

import TableSkeleton from "@/components/skeleton/TableSkeleton";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  deleteSingleExternalSKU,
  getAllExternalSKU,
  storeExternalSKU,
} from "@/hooks/api/dashboardApi";
import { PlusIcon } from "@/components/svg/SvgContainer";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import Swal from "sweetalert2";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";

const allData = {
  "American Red Cross": [
    {
      date: "9/29/2025 8:05:23 PM",
      name: "Redcross Basic Life Support",
      code: "AP-HSSBSL101-r:21",
    },
    {
      date: "9/8/2025 8:40:20 PM",
      name: "Blended Learning Adult First Aid/CPR/AED Online Session",
      code: "AP-HSSSFA514-BL-r:21",
    },
  ],
  "National Safety Council": [
    {
      date: "9/18/2025 10:30:00 PM",
      name: "First Aid & CPR NSC",
      code: "NSC-CPR101",
    },
    {
      date: "9/12/2025 5:45:00 PM",
      name: "Workplace Safety Training",
      code: "NSC-WST201",
    },
  ],
};

const ExternalSkillsPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const queryClient = useQueryClient();

  const [selectedExternal, setSelectedExternal] =
    useState("American Red Cross");
  const [tableData, setTableData] = useState([]);

  // get External SKU data
  const { data: externalSkuData, isLoading: externalSkuDataLoading } =
    getAllExternalSKU();

  // update table when dropdown value changes
  useEffect(() => {
    setTableData(allData[selectedExternal] || []);
  }, [selectedExternal]);

  const handleSelectChange = val => {
    setSelectedExternal(val);
  };

  // delete mutation
  const {
    mutate: deleteExternalSKUMutation,
    isPending: deleteExternalSKUPending,
  } = deleteSingleExternalSKU();

  const handleDeleteExternalSKU = id => {
    deleteExternalSKUMutation(
      {
        endpoint: `/api/external_sku/delete?id=${id}`,
      },
      {
        onSuccess: data => {
          queryClient.invalidateQueries("get-all-external-sku");
          toast.success(data?.message || "External SKU deleted successfully");
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <div className="flex justify-between">
        <SectionTitle title={"External SKU"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
        >
          <Link href={"external-sku/add"}>
            Add External SKU
            <PlusIcon />
          </Link>
        </Button>
      </div>

      {externalSkuDataLoading ? (
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
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Name</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Code</th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {externalSkuData?.data?.data?.length > 0 ? (
                  externalSkuData?.data?.data?.map((item, idx) => (
                    <TableBodyRow key={idx}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {new Date(item?.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.code}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteExternalSKU(item?.id)}
                            className={`p-1.5 sm:p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#6b6c6d] dark:hover:bg-[#7a2828] rounded-lg hover:bg-gray-200 transition ${
                              deleteExternalSKUPending
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                            disabled={deleteExternalSKUPending}
                          >
                            <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px] hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
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
            Links={externalSkuData?.data?.links}
            perPage={externalSkuData?.data?.per_page}
            setPage={setPage}
            setPerPage={setPerPage}
          />
        </div>
      )}
    </section>
  );
};

export default ExternalSkillsPage;
