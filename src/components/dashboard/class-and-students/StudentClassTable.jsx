// src/components/dashboard/class-and-students/StudentClassTable.jsx
"use client";

import { useParams } from "next/navigation";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
  TableFooter,
} from "@/components/common/TableElement";
import { GoArrowUpRight } from "react-icons/go";

export default function StudentClassTable({
  data,
  isLoading,
  links,
  setPage,
  basePath,
}) {
  return (
    <>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <tr>
                <th className="px-3 sm:px-6 py-3">Class ID</th>
                <th className="px-3 sm:px-6 py-3">Date/Time</th>
                <th className="px-3 sm:px-6 py-3">Course</th>
                <th className="px-3 sm:px-6 py-3">Location</th>
                <th className="px-3 sm:px-6 py-3">Instructor</th>
                <th className="px-3 sm:px-6 py-3 text-center">Details</th>
              </tr>
            </TableHead>
            <tbody>
              {(data ?? []).length > 0 ? (
                (data ?? []).map(item => (
                  <TableBodyRow key={item.id}>
                    <td className="px-3 sm:px-6 py-3 text-sm whitespace-nowrap">
                      {item?.class_id}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap align-top">
                      {item.date_time && item.date_time.length > 0 ? (
                        <div className="flex flex-col gap-1.5 max-w-max">
                          {item.date_time.map((i, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-50 dark:bg-neutral-900 text-slate-700"
                            >
                              <span className="text-slate-500 dark:text-gray">
                                {i.date}
                              </span>
                              <span className="text-red-600 dark:bg-dark bg-red-50 px-1.5 py-0.5 rounded font-normal">
                                {i.from} - {i.to}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm truncate max-w-[160px]">
                      {item?.course_name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm truncate max-w-[140px]">
                      {item?.location_name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm whitespace-nowrap">
                      {item?.instructor_name}
                    </td>

                    <td className="px-3 sm:px-6 py-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <TableButton
                          href={`/dashboard/${basePath}/${item.id}`}
                        >
                          <GoArrowUpRight className="text-gray-600 dark:text-gray text-[16px]" />
                        </TableButton>
                      </div>
                    </td>
                  </TableBodyRow>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-400 italic text-sm"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <TableFooter
        Links={links}
        setPage={setPage}
        perPage={10}
        setPerPage={() => {}}
      />
    </>
  );
}
