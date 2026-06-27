"use client"

import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  useGetTSProductOrder,
} from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import Link from "next/link";

const TsProductOrders = ({ts}) => {
  
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  

  const { data: tsProductOrderData, isLoading: tsProductOrderLoading } =
    useGetTSProductOrder(ts, page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
         <div className="flex justify-between">
        <SectionTitle title={"TS Product Orders"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
        >
          <Link href={"ts_product_orders/add"}>
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
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black text-[14px] md:text-[16px] font-semibold">
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Date</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Class
                  </th>
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
              </thead>

              <tbody>
                {tsProductOrderData?.data?.data?.length > 0 ? (
                  tsProductOrderData?.data?.data?.map((item, index) => (
                    <tr
                      key={item?.id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {new Date(item?.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.associated_class}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.status}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        ${item?.total_amount}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <Link
                            href={`ts_product_orders/${item?.id}`}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition "
                          >
                            <CiEdit className="text-gray-600 text-[16px]" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-end mt-3 lg:mt-6 gap-3">
            {/* Pagination */}
            <div className="flex items-center gap-2">
              {tsProductOrderData?.data?.links?.map((link, index) => (
                <button
                  key={index}
                  disabled={link.url === null || link.page === null}
                  onClick={() => link.page && setPage(link.page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    link.active
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "hover:bg-gray-100"
                  } ${
                    link.url === null || link.page === null
                      ? "text-gray-400 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TsProductOrders;
