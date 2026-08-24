// src/components/dashboard/instructors/InstructorsRecord.jsx
"use client";
import SectionTitle from "@/components/common/SectionTitle";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";
import { getAllInstructor, useGetAllUsers } from "@/hooks/api/dashboardApi";
import { CiEdit } from "react-icons/ci";
import React, { useState } from "react";

const InstructorRecord = () => {
  const [page, setPage] = useSiteAwarePagination();
  const [perPage, setPerPage] = useState(10);

  const { data: allInstructor, isLoading } = getAllInstructor({
    page,
    perPage,
  });
  
  return (
    <section className="flex flex-col gap-[13.5px] lg:gap-[25px]">
      <div className="flex justify-between">
        <SectionTitle title={"Instructors"} />
      </div>

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        <div className="flex items-center justify-between">
          <SubSectionTitle subtitle="All list" />
        </div>

        {isLoading ? (
          <TableSkeleton columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Instructor
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    AHA ID
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Certification
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Expires
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {allInstructor?.data?.data?.length > 0 ? (
                  allInstructor.data.data.map(item => (
                    <TableBodyRow key={item.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 dark:text-gray">
                            {item.name}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-[200px]">
                            {item.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.instructor?.aha_instructor_id}
                      </td>
                      <td className="px-3 md:px-6 py-4 truncate max-w-[150px] sm:max-w-[200px]">
                        {item.certifications?.map(cert => (
                          <div key={cert.id}>{cert.discipline_name}</div>
                        ))}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.certifications?.map(cert => (
                          <div key={cert.id}>{cert.expires}</div>
                        ))}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <TableButton href={`instructor-records/${item?.id}`}>
                            <CiEdit className="text-gray-600 text-[16px] dark:text-gray" />
                          </TableButton>
                        </div>
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

        <TableFooter
          Links={allInstructor?.data?.links}
          perPage={allInstructor?.data?.per_page}
          setPage={setPage}
          setPerPage={setPerPage}
        />
      </div>
    </section>
  );
};

export default InstructorRecord;
