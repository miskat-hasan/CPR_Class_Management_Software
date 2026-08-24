"use client";

import SectionTitle from "@/components/common/SectionTitle";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useGetTCProductOrder } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
  TableFooter,
} from "@/components/common/TableElement";

const TsProductOrder = () => {
  const [page, setPage] = useSiteAwarePagination();
  const [perPage, setPerPage] = useState(10);

  const { data: tcProductOrderData, isLoading: tcProductOrderLoading } =
    useGetTCProductOrder(page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title={"TC Product Orders"} />

      {tcProductOrderLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Date</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Site / Class
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Ordered By
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Paid</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {tcProductOrderData?.data?.data?.length > 0 ? (
                  tcProductOrderData?.data?.data?.map((item) => (
                    <TableBodyRow key={item?.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-200">
                        {new Date(item?.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <p className="font-medium dark:text-gray-200">{item?.training_site?.training_center_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item?.associated_class}</p>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <p className="font-medium dark:text-gray-200">
                          {item?.first_name} {item?.last_name}
                        </p>
                        <p className="text-[13px] text-gray-500 dark:text-gray-400">
                          {item?.email}
                        </p>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-200">
                        {item?.status}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-200">
                        {item?.is_paid ? "Yes" : "No"}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-200">
                        ${item?.total_amount}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <TableButton href={`tc-product-orders/${item.id}`}>
                            <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                          </TableButton>
                        </div>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
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
            Links={tcProductOrderData?.data?.links}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </div>
      )}
    </section>
  );
};

export default TsProductOrder;
