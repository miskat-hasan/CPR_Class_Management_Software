"use client";
import SectionTitle from "@/components/common/SectionTitle";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { getAllProductAddOns } from "@/hooks/api/dashboardApi";
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

  const { data: productAddOns, isLoading: productAddOnsLoading } =
    getAllProductAddOns(page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <div className="flex justify-between">
        <SectionTitle title={"Product Add-ons"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
        >
          <Link href={"product-add-ons/add"}>
            New Add on
            <PlusIcon />
          </Link>
        </Button>
      </div>

      {productAddOnsLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Product Code
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Name</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Display Order
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Price</th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {productAddOns?.data?.data?.length > 0 ? (
                  productAddOns?.data?.data?.map((item, index) => (
                    <TableBodyRow key={index}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.product_code}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.display_order}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.price}
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <TableButton href={`product-add-ons/${item.id}`}>
                            <CiEdit className="text-gray-600 text-[16px] dark:text-white" />
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

          {/* Footer controls */}
          <TableFooter
            Links={productAddOns?.data?.links}
            perPage={productAddOns?.data?.per_page}
            setPage={setPage}
            setPerPage={setPerPage}
          />
        </div>
      )}
    </section>
  );
};

export default Page;
