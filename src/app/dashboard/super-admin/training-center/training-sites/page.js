// src/app/dashboard/super-admin/[ts]/training-center/training-sites/page.js
"use client";

import { useState } from "react";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
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
import { getallTrainingsite } from "@/hooks/api/dashboardApi";
import { CiEdit } from "react-icons/ci";

const Page = () => {
  const [page, setPage] = useSiteAwarePagination();
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading } = getallTrainingsite({page, perPage});

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <div className="flex justify-between">
        <SectionTitle title={"Training Sites"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
        >
          <Link href={"training-sites/add"}>
            Add Training Site
            <PlusIcon />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Training Site
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Coordinator
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Email</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Level</th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {data?.data?.data?.length > 0 ? (
                  data.data.data.map(item => (
                    <TableBodyRow key={item?.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.training_center_name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.user?.name ?? "--"}
                      </td>
                      <td className="px-3 md:px-6 py-4 truncate max-w-[150px] sm:max-w-[250px]">
                        {item?.user?.email ?? "--"}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.price_level}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <TableButton href={`training-sites/${item?.id}`}>
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

          <TableFooter
            Links={data?.data?.links}
            perPage={data?.data?.per_page}
            setPage={setPage}
            setPerPage={setPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
