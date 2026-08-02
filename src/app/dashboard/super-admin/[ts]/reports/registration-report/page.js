"use client";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { getRegistrationReport } from "@/hooks/api/dashboardApi";

// ===== Page Component =====
const Page = () => {
  const { data, isLoading } = getRegistrationReport();
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
        {/* <SubSectionTitle subtitle="All Lists" /> */}
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[650px] w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black capitalize text-[16px] sm:text-[20px] font-semibold">
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
              </thead>
              <tbody>
                {data?.data?.registrations?.length > 0 ? (
                  data?.data?.registrations?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                        {item.student_name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                        {item.class_time}
                      </td>
                      <td className="px-3 sm:px-6 py-4 truncate max-w-[200px]">
                        {item.course_name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 truncate max-w-[200px]">
                        {item.status}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-600 whitespace-nowrap">
                        {item.due_amount}
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
      </div>
    </div>
  );
};

export default Page;
