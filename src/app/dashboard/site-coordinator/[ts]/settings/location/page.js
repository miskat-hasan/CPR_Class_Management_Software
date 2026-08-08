"use client";
import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { getAllLocation } from "@/hooks/api/dashboardApi";
import Link from "next/link";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: allLocation, isLoading } = getAllLocation(page, perPage);

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <div className="flex justify-between">
        <SectionTitle title={"Locations"} />
        <Button
          asChild
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
        >
          <Link href="location/add">
            Add Locations <PlusIcon />
          </Link>
        </Button>
      </div>

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Name</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Abbrev
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Directions
                  </th>
                  {/* <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Default
                  </th> */}
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {allLocation?.data?.data.length > 0 ? (
                  allLocation?.data?.data.map((item, index) => (
                    <TableBodyRow key={index}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.abbreviation}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.directions}
                      </td>
                      {/* <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item.default}
                      </td> */}
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <TableButton href={`location/${item.id}`}>
                          <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                        </TableButton>
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

        {/* Footer controls */}
        <TableFooter
          Links={allLocation?.data?.links}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
    </section>
  );
};

export default Page;
