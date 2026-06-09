"use client";
import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";

import { useRouter } from "next/navigation";
import { getAllPromoCode } from "@/hooks/api/dashboardApi";
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

  const { data: promoCodeData, isLoading } = getAllPromoCode(page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <div className="flex justify-between">
        <SectionTitle title={"Promo Codes"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
        >
          <Link href={"promo-codes/add"}>
            New Promo Code
            <PlusIcon />
          </Link>
        </Button>
      </div>

      <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Code</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Start</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">End</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Discount
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Remaining
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {promoCodeData?.data?.data?.length > 0 ? (
                  promoCodeData?.data?.data?.map((item, index) => (
                    <TableBodyRow key={index}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.code}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.description}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.start_date}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.end_date}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.discount}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.remaining}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <TableButton href={`promo-codes/${item.id}`}>
                          <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                        </TableButton>
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

        {/* Footer controls */}
        <TableFooter
          Links={promoCodeData?.data?.links}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
    </section>
  );
};

export default Page;
