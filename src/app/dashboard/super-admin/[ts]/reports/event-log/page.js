"use client"
import React from "react";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import { getEventLog } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

const Page = () => {
  
  const { data: eventLogData, isLoading: eventLogDataLoading } = getEventLog();
  console.log(eventLogData)
  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Event Log"} />
      </div>

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        <SubSectionTitle subtitle="All List" />
        {eventLogDataLoading? (<TableSkeleton />): (

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-black capitalize text-[16px] sm:text-[20px] font-semibold">
              <tr>
                <th className="px-3 sm:px-6 py-3 w-[40px] whitespace-nowrap">
                  User
                </th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                  Time/Date
                </th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                  IP Address
                </th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">Event</th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">Class</th>
              </tr>
            </thead>
            <tbody>
              {eventLogData?.data?.data?.length > 0 ? (
                eventLogData?.data?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{item.user}</p>
                        <p className="text-xs text-gray-500">
                          User ID: {item.id || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {item.created_at}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {item.ip_address}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {item.description}
                    </td>
                    <td className="px-3 sm:px-6 py-4 truncate max-w-[250px]">
                      {item.class}
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
            {eventLogData?.data?.links?.map((link, index) => (
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
