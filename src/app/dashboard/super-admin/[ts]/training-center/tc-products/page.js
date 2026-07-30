"use client";

import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useGetTCProduct } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import Link from "next/link";

const Page = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: tcProductData, isLoading: tsProductLoading } = useGetTCProduct(
    page,
    perPage,
  );

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <div className="flex justify-between">
        <SectionTitle title={"Training Center Products"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
        >
          <Link href={"tc-products/add"}>
            Add New Product
            <PlusIcon />
          </Link>
        </Button>
      </div>

      {tsProductLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black text-[14px] md:text-[16px] font-semibold">
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Product Code
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Name</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Price Level
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Price</th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {tcProductData?.data?.data?.length > 0 ? (
                  tcProductData?.data?.data?.map((item, index) => (
                    <tr
                      key={item?.id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.code}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.price_label}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.price}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <Link
                            href={`tc-products/${item.id}`}
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

          {/* Footer controls */}
          <div className="flex flex-col md:flex-row items-center justify-end mt-3 lg:mt-6 gap-3">
            {/* Show per page */}
            {/* <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Show:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div> */}

            {/* Pagination */}
            <div className="flex items-center gap-2">
              {tcProductData?.data?.links?.map((link, index) => (
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
