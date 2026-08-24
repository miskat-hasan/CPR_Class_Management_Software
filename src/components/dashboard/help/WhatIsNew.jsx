"use client";
import SectionTitle from "@/components/common/SectionTitle";
import NotFound from "@/components/shared/NotFound";
import { getWhatsNew } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
} from "@/components/common/TableElement";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import { useRouter } from "next/navigation";
import { CiEdit } from "react-icons/ci";

const WhatIsNew = () => {
  const router = useRouter();

  const { data: whatsNewData, isLoading: whatsNewDataLoading } = getWhatsNew();

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <SectionTitle title={"What’s New"} />
        <Button
          onClick={() => router.push("whats-new/add")}
          className="py-[11px] text-[12px] lg:text-base lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown hover:bg-brown flex items-center gap-2 text-white"
        >
          Add New
          <PlusIcon />
        </Button>
      </div>

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        {whatsNewDataLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 py-3 md:px-6 w-[150px] md:w-[200px] whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-3 py-3 md:px-6 whitespace-nowrap">
                    Update
                  </th>
                  <th className="px-3 py-3 md:px-6 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>

              <tbody>
                {whatsNewData?.data?.length > 0 ? (
                  whatsNewData?.data?.map((item) => (
                    <TableBodyRow key={item?.id}>
                      <td className="px-3 py-3 md:px-6 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {new Date(item?.created_at).toLocaleDateString(
                          "en-US",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                      </td>
                      <td className="px-3 py-3 md:px-6 text-gray-800 dark:text-gray-200">
                        {item?.title}
                      </td>
                      <td className="px-3 py-4 md:px-6 text-center whitespace-nowrap">
                        <TableButton href={`whats-new/${item.id}`}>
                          <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                        </TableButton>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-3 lg:py-6 text-gray-500 italic"
                    >
                      <NotFound title="No Record Found" />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIsNew;
