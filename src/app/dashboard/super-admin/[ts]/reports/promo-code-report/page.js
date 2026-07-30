"use client";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { getPromoCodeReport } from "@/hooks/api/dashboardApi";

const Page = () => {
  const { data, isLoading } = getPromoCodeReport();

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <SectionTitle title={"Promo Code Reports"} />
      </div>

      {/* Filters */}
      {/* <div className="px-[16px] sm:px-[32px] py-[24px] sm:py-[32px] bg-white dark:bg-black rounded-[16px] flex flex-col lg:flex-row gap-[16px] lg:gap-[24px]">
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
          className="flex-1 min-w-[180px]"
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
          className="flex-1 min-w-[180px]"
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
          className="flex-1 min-w-[180px]"
        />

        <div className="flex justify-end items-end">
          <Button
            onClick={handleSearch}
            className="py-[18px] sm:py-[24px] w-full sm:w-auto bg-brown dark:bg-dark-brown flex items-center justify-center gap-2"
          >
            <SearchIcon />
            Search
          </Button>
        </div>
      </div> */}

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        {/* <SubSectionTitle subtitle="All Lists" /> */}
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black capitalize text-[14px] sm:text-[18px] font-semibold">
                <tr>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Student
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Reg Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Course
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Promo Code
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.length > 0 ? (
                  data?.data?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                        {item.student}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                        {item.reg_date}
                      </td>
                      <td className="px-3 sm:px-6 py-4 truncate max-w-[180px]">
                        {item.course}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {item.promo_code}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-600 whitespace-nowrap">
                        {item.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
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
      </div>
    </div>
  );
};

export default Page;
