"use client";

import SectionTitle from "@/components/common/SectionTitle";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useGetTCProductOrder } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import Link from "next/link";

const Page = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: tcProductOrderData, isLoading: tcProductOrderLoading } =
    useGetTCProductOrder(page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <SectionTitle title={"TC Product Orders"} />

      {tcProductOrderLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black text-[14px] md:text-[16px] font-semibold">
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
              </thead>

              <tbody>
                {tcProductOrderData?.data?.data?.length > 0 ? (
                  tcProductOrderData?.data?.data?.map((item, index) => (
                    <tr
                      key={item?.id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {new Date(item?.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <p>{item?.training_site?.training_center_name}</p>
                        <p className="text-xs">{item?.associated_class}</p>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <p className="font-medium">
                          {item?.first_name} {item?.last_name}
                        </p>
                        <p className="text-[13px] text-gray-500">
                          {item?.email}
                        </p>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.status}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.is_paid ? "Yes" : "No"}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        ${item?.total_amount}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <Link
                            href={`tc-product-orders/${item.id}`}
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
              {tcProductOrderData?.data?.links?.map((link, index) => (
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

export default Page;
