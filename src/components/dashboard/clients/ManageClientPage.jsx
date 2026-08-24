// src/components/dashboard/clients/ManageClientPage.jsx
"use client";

import { useState } from "react";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import { getAllClient } from "@/hooks/api/dashboardApi";
import { CiEdit } from "react-icons/ci";

const ManageClientPage = () => {
  const [page, setPage] = useSiteAwarePagination();
  const [perPage, setPerPage] = useState(10);

  const { data: clientList, isLoading } = getAllClient(page, perPage);

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <div className="flex justify-between">
        <SectionTitle title={"Client List"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
        >
          <Link href={"add-client"}>
            Add Client
            <PlusIcon />
          </Link>
        </Button>
      </div>

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All List" />

        {isLoading ? (
          <TableSkeleton columns={7} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Company
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Abbrev
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Contact
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Phone</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Email</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Contact Date
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {clientList?.data?.data?.length > 0 ? (
                  clientList.data.data.map(item => (
                    <TableBodyRow key={item.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.company}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.abbreviation}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.contact_first_name} {item.contact_last_name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.mobile_phone}
                      </td>
                      <td className="px-3 md:px-6 py-4 truncate max-w-[180px] sm:max-w-[220px]">
                        {item.email}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.contact_date}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <TableButton href={`manage-clients/${item.id}`}>
                            <CiEdit className="text-gray-600 text-[16px] dark:text-gray" />
                          </TableButton>
                        </div>
                      </td>
                    </TableBodyRow>
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
            </Table>
          </div>
        )}

        <TableFooter
          Links={clientList?.data?.links}
          perPage={clientList?.data?.per_page}
          setPage={setPage}
          setPerPage={setPerPage}
        />
      </div>
    </div>
  );
};

export default ManageClientPage;
