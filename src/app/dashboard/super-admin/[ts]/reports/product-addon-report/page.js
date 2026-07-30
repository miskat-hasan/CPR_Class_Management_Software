"use client";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { Button } from "@/components/ui/button";
import { getProductAddOnsReport } from "@/hooks/api/dashboardApi";
import { SearchIcon } from "@/components/svg/SvgContainer";
import React, { useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({ month: "" });

  const { data: productAddOnsReport, isLoading: productAddOnsReportLoading } =
    getProductAddOnsReport(page);

  const handleSelectChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const filtered = tableData.filter((item) => {
      const matchMonth =
        !filters.month ||
        item.month.toLowerCase().includes(filters.month.toLowerCase());
      return matchMonth;
    });
    setFilteredData(filtered);
  };

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Products Add-on Reports"} />
      </div>

      {/* Search filters */}
      {/* <div className="lg:px-[32px] px-[16px] py-[16px] lg:py-[32px] bg-white dark:bg-black rounded-[16px] flex gap-[12px] flex-wrap  lg:gap-[24px]">
        <CustomSelect
          id="month"
          label="Month"
          placeholder="All Month"
          options={[
            { value: "january", label: "January" },
            { value: "february", label: "February" },
            { value: "march", label: "March" },
            { value: "october", label: "October" },
          ]}
          onChange={(val) => handleSelectChange("month", val)}
          className="flex-1"
        />

        <div className="flex justify-end items-end">
          <Button
            onClick={handleSearch}
            className="py-[12px] lg:py-[24px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
          >
            <SearchIcon />
            Search
          </Button>
        </div>
      </div> */}

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        {/* <SubSectionTitle subtitle="All Lists" /> */}
        {productAddOnsReportLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black capitalize text-[14px] sm:text-[16px] font-semibold">
                <tr>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Product Code
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Product Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Unit Price
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Total Sales
                  </th>
                </tr>
              </thead>
              <tbody>
                {productAddOnsReport?.data?.items_report?.length > 0 ? (
                  productAddOnsReport?.data?.items_report?.map(
                    (item, index) => (
                      <tr
                        key={item?.product_id}
                        className="border-b hover:bg-gray-50 transition-all"
                      >
                        <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-gray-800 truncate max-w-[220px]">
                          {item.name}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {item.total_qty}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {item.unit_price}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {item.total_sales}
                        </td>
                      </tr>
                    ),
                  )
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
            </table>
            {productAddOnsReport?.data?.total_sell_sum && (
              <div className="flex items-center gap-4 justify-end mt-3 mx-3">
                <div>Total: </div>
                <div>{productAddOnsReport?.data?.total_sell_sum}</div>
              </div>
            )}
          </div>
        )}

        {/* Footer controls */}
        {/* <div className="flex flex-col md:flex-row items-center justify-end mt-3 lg:mt-6 gap-3"> */}
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
          {/* <div className="flex items-center gap-2">
            {productAddOnsReport?.data?.links?.map((link, index) => (
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
        </div> */}
      </div>
    </div>
  );
};

export default Page;
