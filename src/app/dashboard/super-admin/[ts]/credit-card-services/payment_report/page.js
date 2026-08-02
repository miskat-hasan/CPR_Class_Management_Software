"use client";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
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
        {/* <div className="flex items-center justify-between">
          {" "}
          <SubSectionTitle subtitle="All List" />
          <Button
            asChild
            className="py-[11px] lg:py-[22px] text-[12px] lg:text-base cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
          >
            <Link href={`funding_reports`}>
            Funding Report $
            </Link>
          </Button>
        </div> */}
        {paymentReportLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black capitalize text-[16px] md:text-[20px] font-semibold">
                <tr>
                  <th className="px-3 py-2 md:px-6 md:py-3 w-[40px] whitespace-nowrap">
                    Date/Time
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Name/Email
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    status
                  </th>
                  {/* <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                  Type
                </th> */}
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Tx ID
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 whitespace-nowrap">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentReport?.data?.length > 0 ? (
                  paymentReport?.data?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 py-2 md:px-6 md:py-4 text-gray-800">
                        {item.date_time}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 text-gray-800">
                        <p className="font-medium">{item.student_name}</p>
                        <p className="text-[13px] text-neutral-600">
                          {item.student_email}
                        </p>
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4">
                        <p className="truncate max-w-[150px] md:max-w-none">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4">
                        {item.status}
                      </td>
                      {/* <td className="px-3 py-2 md:px-6 md:py-4">{item.type}</td> */}
                      <td className="px-3 py-2 md:px-6 md:py-4 truncate max-w-[200px]">
                        {item.tx_id}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4">
                        {item.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-3 lg:py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
