"use client";

import React, { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import { CiEdit } from "react-icons/ci";
import { getAllClient } from "@/hooks/api/dashboardApi";
import Link from "next/link";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

const Page = () => {
  const [selectedShow, setSelectedShow] = useState(50);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

  const { data: clientList, isLoading } = getAllClient(page, perPage);

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Client List"} />
      </div>

      {/* Table */}
      <div className="p-[13px] lg:p-[26px]  bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <div>
          <SubSectionTitle subtitle="All List" />
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm sm:text-base text-left text-gray-700">
              <thead className="bg-gray-50 text-black capitalize text-[16px] sm:text-[20px] font-semibold text-nowrap">
                <tr>
                  <th className="px-3 sm:px-6 md:py-3">Company</th>
                  <th className="px-3 sm:px-6 md:py-3">Abbrev</th>
                  <th className="px-3 sm:px-6 md:py-3">Contact</th>
                  <th className="px-3 sm:px-6 md:py-3">Phone</th>
                  <th className="px-3 sm:px-6 md:py-3">Email</th>
                  <th className="px-3 sm:px-6 md:py-3">Contact Date</th>
                  <th className="px-3 sm:px-6 md:py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {clientList?.data?.data?.length > 0 ? (
                  clientList?.data?.data?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 sm:px-6 py-3 text-gray-800 whitespace-nowrap">
                        {item.company}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.abbreviation}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.contact_first_name} {item.contact_last_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.mobile_phone}
                      </td>
                      <td className="px-3 sm:px-6 py-3 truncate max-w-[180px] sm:max-w-[220px]">
                        {item.email}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.contact_date}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <Link href={`manage-clients/${item.id}`}>
                          <button className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                            <CiEdit className="text-gray-600 text-[14px] sm:text-[16px]" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

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
            {clientList?.data?.links?.map((link, index) => (
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
    </div>
  );
};

export default Page;
