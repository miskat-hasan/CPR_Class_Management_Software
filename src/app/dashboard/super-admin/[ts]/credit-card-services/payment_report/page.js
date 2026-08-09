"use client";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
} from "@/components/common/TableElement";
import { useGetPaymentReport } from "@/hooks/api/dashboardApi";

const Page = () => {
  const { data: paymentReport, isLoading: paymentReportLoading } =
    useGetPaymentReport();

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Payment Report"} />
      </div>

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        {paymentReportLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Date/Time
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Name/Email
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap capitalize">
                    Status
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Tx ID
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Amount
                  </th>
                </tr>
              </TableHead>
              <tbody>
                {paymentReport?.data?.length > 0 ? (
                  paymentReport?.data?.map((item, index) => (
                    <TableBodyRow key={index}>
                      <td className="px-3 py-2 md:px-6 md:py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {item.date_time}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                        <p className="font-medium dark:text-white">{item.student_name}</p>
                        <p className="text-[13px] text-neutral-600 dark:text-neutral-400">
                          {item.student_email}
                        </p>
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 dark:text-gray-300">
                        <p className="truncate max-w-[150px] md:max-w-none">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 dark:text-gray-300">
                        {item.status}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 truncate max-w-[200px] dark:text-gray-300">
                        {item.tx_id}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 font-medium dark:text-gray-200">
                        {item.amount}
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-3 lg:py-6 text-gray-500 dark:text-gray-400 italic"
                    >
                      No results found
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

export default Page;
