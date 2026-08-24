// src/components/dashboard/Instructors/CertificationsList.jsx
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBodyRow,
  TableHead,
} from "@/components/common/TableElement";
import CertificationModal from "./CertificationModal";

const CertificationsList = ({ instructorId, CertificationData, isLoading }) => {
  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px] mt-8">
      <div className="flex justify-between items-center">
        <SectionTitle title={"Certifications List"} />
        <CertificationModal mode="add" instructorId={instructorId} />
      </div>

      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
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
                {CertificationData?.length > 0 ? (
                  CertificationData.map((item, index) => (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsList;
