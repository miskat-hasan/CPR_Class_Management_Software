"use client";
import SectionTitle from "@/components/common/SectionTitle";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Table, TableHead, TableBodyRow, TableFooter } from "@/components/common/TableElement";
import { getClassReport } from "@/hooks/api/dashboardApi";
import { useState } from "react";

const ClassReport = () => {
  const [page, setPage] = useSiteAwarePagination();
  const { data: classReportData, isLoading: classReportDataLoading } =
    getClassReport(page);

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Class Reports"} />
     
      </div>

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All Lists" />
        {classReportDataLoading ? (<TableSkeleton />): (

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <tr>
                <th className="px-3 sm:px-6 py-3 w-[100px] whitespace-nowrap">
                  Date/Time
                </th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                  Instructor
                </th>
                <th className="px-3 sm:px-6 py-3">Course</th>
                <th className="px-3 sm:px-6 py-3">Location</th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                  Enrolled
                </th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">Hours</th>
              </tr>
            </TableHead>
            <tbody>
              {classReportData?.data?.data?.length > 0 ? (
                classReportData?.data?.data?.map((item) => (
                  <TableBodyRow key={item.id}>
                    <td className="px-3 sm:px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {item.class_times[0]?.date}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {item.instructor?.first_name} {" "}
                      {item.instructor?.last_name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 truncate max-w-[200px]">
                      {item.course_id}
                    </td>
                    <td className="px-3 sm:px-6 py-4 truncate max-w-[200px]">
                      {item.location_name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {item.enrolled}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {item.total_hours}
                    </td>
                  </TableBodyRow>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
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
         Links={classReportData?.data?.links}
         setPage={setPage}
       />
      </div>
    </div>
  );
};

export default ClassReport;
