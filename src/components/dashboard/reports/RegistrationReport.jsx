"use client";
import SectionTitle from "@/components/common/SectionTitle";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Table, TableHead, TableBodyRow, TableFooter } from "@/components/common/TableElement";
import { getRegistrationReport } from "@/hooks/api/dashboardApi";

// ===== Component =====
const RegistrationReport = () => {
  const [page, setPage] = useSiteAwarePagination();
  const { data, isLoading } = getRegistrationReport(page);

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Registration Reports"} />
      </div>

      {/* Filters */}
      {/* <div className="lg:px-[32px] px-[16px] py-[16px] lg:py-[32px] bg-white dark:bg-black rounded-[16px] flex gap-[12px] flex-wrap lg:gap-[24px]">
        <CustomSelect
          id="registration"
          label="Registration Date"
          placeholder="Select registration range"
          options={[
            { value: "today", label: "Today" },
            { value: "yesterday", label: "Yesterday" },
            { value: "last7", label: "Last 7 days" },
            { value: "last30", label: "Last 30 days" },
          ]}
          onChange={(val) => handleSelectChange("registration", val)}
          className="flex-1"
        />
        <CustomSelect
          id="month"
          label="Month"
          placeholder="Select month"
          options={[
            { value: "January", label: "January" },
            { value: "February", label: "February" },
            { value: "March", label: "March" },
            { value: "April", label: "April" },
            { value: "May", label: "May" },
            { value: "June", label: "June" },
            { value: "July", label: "July" },
            { value: "August", label: "August" },
            { value: "September", label: "September" },
            { value: "October", label: "October" },
            { value: "November", label: "November" },
            { value: "December", label: "December" },
          ]}
          onChange={(val) => handleSelectChange("month", val)}
          className="flex-1"
        />
        <CustomSelect
          id="promoCode"
          label="Promo Code"
          placeholder="Select promo code"
          options={[
            { value: "NEW2025", label: "NEW2025" },
            { value: "WELCOME10", label: "WELCOME10" },
            { value: "SUMMER50", label: "SUMMER50" },
            { value: "BLACK75", label: "BLACK75" },
          ]}
          onChange={(val) => handleSelectChange("promoCode", val)}
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
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Student Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Reg Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Class Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Course Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Balance Due
                  </th>
                </tr>
              </TableHead>
              <tbody>
                {data?.data?.registrations?.data?.length > 0 ? (
                  data?.data?.registrations?.data?.map(item => (
                    <TableBodyRow key={item.id}>
                      <td className="px-3 sm:px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {item.student_name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {item.class_time}
                      </td>
                      <td className="px-3 sm:px-6 py-4 truncate max-w-[200px]">
                        {item.course_name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 truncate max-w-[200px]">
                        {item.status}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {item.due_amount}
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {data?.data?.total_due_sum && (
              <div className="flex items-center dark:text-gray-200 text-gray-800 gap-4 justify-end mt-3 mx-3">
                <div>Total: </div>
                <div>{data?.data?.total_due_sum}</div>
              </div>
            )}
          </div>
        )}

        <TableFooter
          Links={data?.data?.registrations?.links}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default RegistrationReport;
