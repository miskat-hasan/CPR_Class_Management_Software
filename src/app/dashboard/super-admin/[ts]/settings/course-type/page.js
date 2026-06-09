"use client";

import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getAllCourses } from "@/hooks/api/dashboardApi";
import { PlusIcon } from "@/components/svg/SvgContainer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import SectionTitle from "@/components/common/SectionTitle";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";

const Page = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

  const { data: coursesTypeData, isLoading: coursesTypeLoading } =
    getAllCourses(page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <div className="flex justify-between">
        <SectionTitle title={"Course Type"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
        >
          <Link href={"course-type/add"}>
            Add Course Type
            <PlusIcon />
          </Link>
        </Button>
      </div>

      {coursesTypeLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Name</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Discipline
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Add-ons
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Price</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Ship</th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {coursesTypeData?.data?.data?.length > 0 ? (
                  coursesTypeData?.data?.data?.map((item, index) => (
                    <TableBodyRow key={index}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.course_name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.discipline_name?.name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.addons.length > 0
                          ? item.addons?.product_code
                          : "--"}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        ${item.price}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        ${item.shipping_price}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <TableButton href={`course_type/${item.id}`}>
                            <CiEdit className="text-gray-600 text-[16px] dark:text-gray" />
                          </TableButton>
                        </div>
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

          {/* Footer controls */}
          <TableFooter
            Links={coursesTypeData?.data?.links}
            perPage={coursesTypeData?.data?.per_page}
            setPage={setPage}
            setPerPage={setPerPage}
          />
        </div>
      )}
    </section>
  );
};

export default Page;
