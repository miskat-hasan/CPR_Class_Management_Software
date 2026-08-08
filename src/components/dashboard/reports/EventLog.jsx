"use client"
import React from "react";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import { getEventLog } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Table, TableHead, TableBodyRow, TableFooter } from "@/components/common/TableElement";
import { useState } from "react";

const EventLog = () => {
  const [page, setPage] = useState(1);
  const { data: eventLogData, isLoading: eventLogDataLoading } = getEventLog(page);
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
          <Table>
            <TableHead>
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
            </TableHead>
            <tbody>
              {eventLogData?.data?.data?.length > 0 ? (
                eventLogData?.data?.data?.map((item, index) => (
                  <TableBodyRow key={index} className="cursor-pointer">
                    <td className="px-3 sm:px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{item.user}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
                  </TableBodyRow>
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
          </Table>
        </div>
        )}

        {/* Footer controls */}
        <TableFooter
          Links={eventLogData?.data?.links}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default EventLog;
