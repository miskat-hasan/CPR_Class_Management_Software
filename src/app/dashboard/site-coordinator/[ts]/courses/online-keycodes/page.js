"use client";
import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { getAllKeyCodeBank } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import Link from "next/link";
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

  const { data: keycodeData, isLoading: keycodeDataLoading } =
    getAllKeyCodeBank(page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <div className="flex justify-between">
        <SectionTitle title={"Keycode Banks"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] text-[12px] lg:text-base cursor-pointer bg-brown dark:bg-dark-brown dark:hover:bg-brown flex items-center gap-2"
        >
          <Link href={"online-keycodes/add"}>
            Add keycode bank <PlusIcon />
          </Link>
        </Button>
      </div>

      <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        {keycodeDataLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Name</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Total</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Unused
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {keycodeData?.data?.data?.length > 0 ? (
                  keycodeData?.data?.data?.map((item, index) => (
                    <TableBodyRow key={index}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className="font-medium ">{item.name}</span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.total_links}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.total_links - item.used}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <TableButton href={`online-keycodes/${item.id}`}>
                          <CiEdit className="text-gray-600 text-[16px] dark:text-gray" />
                        </TableButton>
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
        )}

        {/* Footer controls */}
        <TableFooter
          Links={keycodeData?.data?.links}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
    </section>
  );
};

export default Page;
