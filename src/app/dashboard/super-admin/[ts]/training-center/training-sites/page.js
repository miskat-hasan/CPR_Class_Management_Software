"use client";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getallTrainingsite } from "@/hooks/api/dashboardApi";
import { PlusIcon } from "@/components/svg/SvgContainer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";

const Page = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({
    name: "",
    status: "",
  });

  const { data, isLoading } = getallTrainingsite(page, perPage);
  const handleNavigation = () => {
    
  };
  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Training Sites"} />

        <Button
          onClick={()=> router.push("add-new-training-site")}
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
        >
          Add Training Site <PlusIcon />
        </Button>
      </div>

      {/* <div>
        <div className="flex gap-2.5 items-center">
          <input type="checkbox" />
          <label className="text-[12px] font-bold">Show archived sites</label>
        </div>
      </div> */}

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm sm:text-base text-left text-gray-700">
              <thead className="bg-gray-50 text-black capitalize text-[14px] sm:text-[20px] font-semibold">
                <tr>
                  <th className="px-3 sm:px-6 py-3">Company</th>
                  <th className="px-3 sm:px-6 py-3">Contact</th>
                  <th className="px-3 sm:px-6 py-3">Email</th>
                  <th className="px-3 sm:px-6 py-3">Level</th>
                  <th className="px-3 sm:px-6 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {data?.data?.length > 0 ? (
                  data?.data?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 sm:px-6 py-3 text-gray-800 whitespace-nowrap">
                        {item?.company_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item?.contact_first_name} {item?.contact_last_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 truncate max-w-[150px] sm:max-w-[250px]">
                        {item.email}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.price_level}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <Link
                          href={`training-sites/${item?.id}`}
                          className="p-1.5 sm:p-2 bg-gray-100 rounded-lg inline-block hover:bg-gray-200 transition"
                        >
                          <CiEdit className="text-gray-600 text-[14px] sm:text-[16px]" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-3 sm:py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer controls */}
        <div className="flex flex-col md:flex-row items-center justify-end mt-3 lg:mt-6 gap-3">
          {/* Show per page */}
          {/* <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Show:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div> */}

          {/* Pagination */}
          <div className="flex items-center gap-2">
            {data?.data?.links?.map((link, index) => (
              <button
                key={index}
                disabled={link.url === null || link.page === null}
                onClick={() => link.page && setPage(link.page)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  link.active
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "hover:bg-gray-100"
                } ${
                  link.url === null || link.page === null
                    ? "text-gray-400 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
        </div>
      )}

      {/* <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle={"External Training Sites"} />
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm sm:text-base text-left text-gray-700">
            <thead className="bg-gray-50 text-black capitalize text-[16px] sm:text-[20px] font-semibold">
              <tr>
                <th className="px-3 sm:px-6 py-3">Company</th>
                <th className="px-3 sm:px-6 py-3">Contact</th>
                <th className="px-3 sm:px-6 py-3">Email</th>
                <th className="px-3 sm:px-6 py-3">Level</th>
                <th className="px-3 sm:px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {TrainingSiteData.length > 0 ? (
                TrainingSiteData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-3 sm:px-6 py-3 text-gray-800 whitespace-nowrap">
                      {item?.company}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-800 whitespace-nowrap">
                      {item.contact}
                    </td>
                    <td className="px-3 sm:px-6 py-3 truncate max-w-[180px] sm:max-w-[220px]">
                      {item.email}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      {item.level}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-center">
                      <button className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                        <CiEdit className="text-gray-600 text-[14px] sm:text-[16px]" />
                      </button>
                    </td>
                  </tr>
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
          </table>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Show:</span>
            <select
              value={selectedShow}
              onChange={(e) => setSelectedShow(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

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
        </div>
      </div> */}
    </div>
  );
};

export default Page;
