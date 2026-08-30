// src/components/dashboard/Instructors/CertificationsList.jsx
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBodyRow,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";
import CertificationModal from "./CertificationModal";
import { getAllCertifications } from "@/hooks/api/dashboardApi";
import { useState } from "react";

const CertificationsList = ({ instructorId, isLoading }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: CertificationData } = getAllCertifications({
    instructorId,
    page,
    perPage,
  });

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="flex justify-between border-b dark:border-gray-700 pb-3">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              Certifications List
            </h2>
            <CertificationModal mode="add" instructorId={instructorId} />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Discipline
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Initial
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
                {CertificationData?.data?.data?.length > 0 ? (
                  CertificationData?.data?.data?.map((item, index) => (
                    <TableBodyRow key={item?.id ?? index}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.discipline_name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.initial}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.expires}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <CertificationModal
                            mode="edit"
                            instructorId={instructorId}
                            certificationId={item?.id}
                          />
                        </div>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <TableFooter
              Links={CertificationData?.data?.links}
              setPage={setPage}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificationsList;
