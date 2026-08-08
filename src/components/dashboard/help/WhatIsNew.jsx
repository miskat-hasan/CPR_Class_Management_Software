"use client";
import SectionTitle from "@/components/common/SectionTitle";
import NotFound from "@/components/shared/NotFound";
import { getWhatsNew } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";

const WhatIsNew = () => {
  const router = useRouter();

  const { data: whatsNewData, isLoading: whatsNewDataLoading } = getWhatsNew();

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"What’s New"} />
        <Button
          onClick={() => router.push("whats-new/add")}
          className="py-[11px] text-[12px] lg:text-base lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
        >
          Add New
          <PlusIcon />
        </Button>
      </div>

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <div className="flex items-center justify-between"></div>

        {whatsNewDataLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white capitalize text-[16px] md:text-[20px] font-semibold">
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
              </thead>

              <tbody>
                {whatsNewData?.data?.length > 6 ? (
                  whatsNewData?.data?.map((item, index) => (
                    <tr
                      key={item?.id}
                      className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                    >
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
                        <Link href={`whats-new/${item.id}`}>
                          <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
                            <CiEdit className="text-gray-600 dark:text-gray-400 text-[16px]" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center py-3 lg:py-6 text-gray-500 italic"
                    >
                      <NotFound title="No Record Found" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer controls */}
        {/* <div className="flex flex-col md:flex-row items-center justify-between mt-3 lg:mt-6 gap-3">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-500 border rounded-md hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 text-sm border border-blue-500 rounded-md text-blue-600">
              1
            </button>
            <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">
              3
            </button>
            <button className="px-3 py-1 text-sm text-gray-500 border rounded-md hover:bg-gray-100">
              Next
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default WhatIsNew;
