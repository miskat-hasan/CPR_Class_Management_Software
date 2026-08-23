"use client";

import SectionTitle from "@/components/common/SectionTitle";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useGetTSProductOrder } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
  TableFooter,
} from "@/components/common/TableElement";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

const TsProductOrders = () => {
  const { selectedTrainingSiteId } = useAuth();
  const [page, setPage] = useSiteAwarePagination();
  const [perPage, setPerPage] = useState(10);

  const { data: tsProductOrderData, isLoading: tsProductOrderLoading } =
    useGetTSProductOrder(selectedTrainingSiteId, page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <div className="flex justify-between items-center">
        <SectionTitle title={"TS Product Orders"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown hover:bg-brown flex items-center gap-2 text-white"
        >
          <Link href={"order-tc-product/add"}>
            Add New Order
            <PlusIcon />
          </Link>
        </Button>
      </div>

      {tsProductOrderLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Date</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Class</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {tsProductOrderData?.data?.data?.length > 0 ? (
                  tsProductOrderData?.data?.data?.map(item => (
                    <TableBodyRow key={item?.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-200">
                        {new Date(item?.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-200">
                        {item?.associated_class}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-200">
                        {item?.status}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-200">
                        ${item?.total_amount}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <TableButton href={`ts_product_orders/${item?.id}`}>
                            <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                          </TableButton>
                        </div>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <TableFooter
            Links={tsProductOrderData?.data?.links}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </div>
      )}
    </section>
  );
};

export default TsProductOrders;
