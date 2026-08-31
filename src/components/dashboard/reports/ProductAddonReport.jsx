"use client";
import SectionTitle from "@/components/common/SectionTitle";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Table, TableHead, TableBodyRow, TableFooter } from "@/components/common/TableElement";
import { getProductAddOnsReport } from "@/hooks/api/dashboardApi";
import React, { useState } from "react";

const ProductAddonReport = () => {
  const [page, setPage] = useSiteAwarePagination();

  const { data: productAddOnsReport, isLoading: productAddOnsReportLoading } =
    getProductAddOnsReport(page);

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
        {productAddOnsReportLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
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
              </TableHead>
              <tbody>
                {productAddOnsReport?.data?.items_report?.data?.length > 0 ? (
                  productAddOnsReport?.data?.items_report?.data?.map(
                    (item, index) => (
                      <TableBodyRow key={item?.product_id}>
                        <td className="px-3 sm:px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-gray-800 dark:text-gray-200 truncate max-w-[220px]">
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
                      </TableBodyRow>
                    ),
                  )
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
            {productAddOnsReport?.data?.total_sell_sum && (
              <div className="flex items-center dark:text-gray-200 text-gray-800 gap-4 justify-end mt-3 mx-3">
                <div>Total: </div>
                <div>{productAddOnsReport?.data?.total_sell_sum}</div>
              </div>
            )}
          </div>
        )}

        {/* Footer controls */}
        <TableFooter
          Links={productAddOnsReport?.data?.items_report?.links}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default ProductAddonReport;
