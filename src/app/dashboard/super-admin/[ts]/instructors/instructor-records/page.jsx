"use client";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { Button } from "@/components/ui/button";
import { getAllInstructor } from "@/hooks/api/dashboardApi";
import { SearchIcon } from "@/components/svg/SvgContainer";
import Link from "next/link";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";

const Page = () => {
  const [selectedShow, setSelectedShow] = useState(50);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: allInstructor, isLoading } = getAllInstructor(page, perPage);
  return (
    <section className="flex flex-col gap-[13.5px] lg:gap-[25px] ">
      <div className="flex justify-between">
        <SectionTitle title={"Instructors"} />
      </div>
      {/* <div className="px-[13px] py-[13px] lg:px-[26px] lg:py-[32px] bg-white dark:bg-black rounded-[16px] flex flex-col gap-2.5 ">
        <div className="flex w-full justify-between">
          <SectionTitle
            className={"!text-base lg:!text-[20px]"}
            title={"Training Site"}
          /> */}
      {/* <div className="flex items-center gap-1 lg:gap-2 text-[#8C8C8C]">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 bg-transparent accent-[#8C8C8C]"
            />
            <label className="text-[12px]">Show Inactive Users</label>
          </div> */}
      {/* </div> */}
      {/* <div className="flex justify-center items-center gap-2.5">
          <CustomSelect
            id="Courses"
            placeholder="All courses"
            options={[
              { value: "anatomy basics", label: "Anatomy Basics" },
              {
                value: "pharmacology fundamentals",
                label: "Pharmacology Fundamentals",
              },
              {
                value: "medical imaging techniques",
                label: "Medical Imaging Techniques",
              },
              {
                value: "emergency medicine essentials",
                label: "Emergency Medicine Essentials",
              },
            ]}
            // onChange={(val) => handleSelectChange("course", val)}
            className="flex-1"
          />
          <Button className="py-[12px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2">
            <SearchIcon />
            Search
          </Button>
        </div> */}
      {/* </div> */}

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        <div className="flex items-center justify-between">
          <SubSectionTitle subtitle="All list" />
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm sm:text-base text-left text-gray-700">
              <thead className="bg-gray-50 text-black text-[14px] sm:text-[16px] font-semibold">
                <tr>
                  <th className="px-3 sm:px-6 py-3">Instructor</th>
                  <th className="px-3 sm:px-6 py-3">AHA ID</th>
                  <th className="px-3 sm:px-6 py-3">Certification</th>
                  <th className="px-3 sm:px-6 py-3">Expires</th>
                  <th className="px-3 sm:px-6 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading || allInstructor?.data?.data?.length > 0 ? (
                  allInstructor?.data?.data?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 sm:px-6 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {item.first_name} {item.last_name}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
                            {item.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.aha_instructor_id}
                      </td>
                      <td className="px-3 sm:px-6 py-3 truncate max-w-[150px] sm:max-w-[200px]">
                        {item.certifications?.map((item) => (
                          <div key={item.id}>BLS</div>
                        ))}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.certifications?.map((item) => (
                          <div key={item.id}>{item.expires}</div>
                        ))}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <div>
                          <Link
                            href={`instructor-records/${item?.id}`}
                            className="p-1.5 sm:p-2 bg-gray-100 rounded-lg inline-block hover:bg-gray-200 transition"
                          >
                            <CiEdit className="text-gray-600 text-[14px] sm:text-[16px]" />
                          </Link>
                        </div>
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
        )}

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
            {allInstructor?.data?.links?.map((link, index) => (
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
    </section>
  );
};

export default Page;
