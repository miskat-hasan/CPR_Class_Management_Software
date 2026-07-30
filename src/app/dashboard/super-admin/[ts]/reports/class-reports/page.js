"use client";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { getClassReport } from "@/hooks/api/dashboardApi";

const Page = () => {
  const { data: classReportData, isLoading: classReportDataLoading } =
    getClassReport();

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Class Reports"} />
     
      </div>

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All Lists" />
        {classReportDataLoading ? (<TableSkeleton />): (

        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-black capitalize text-[16px] sm:text-[18px] lg:text-[20px] font-semibold">
              <tr>
                <th className="px-3 sm:px-6 py-3 w-[100px] whitespace-nowrap">
                  Date/Time
                </th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                  Instructor
                </th>
                <th className="px-3 sm:px-6 py-3">Course</th>
                <th className="px-3 sm:px-6 py-3">Location</th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                  Enrolled
                </th>
                <th className="px-3 sm:px-6 py-3 whitespace-nowrap">Hours</th>
              </tr>
            </thead>
            <tbody>
              {classReportData?.data?.data?.length > 0 ? (
                classReportData?.data?.data?.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                      {item.class_times[0]?.date}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-800 whitespace-nowrap">
                      {item.instructor?.first_name} {" "}
                      {item.instructor?.last_name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 truncate max-w-[200px]">
                      {item.course_id}
                    </td>
                    <td className="px-3 sm:px-6 py-4 truncate max-w-[200px]">
                      {item.location_name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-600 whitespace-nowrap">
                      {item.enrolled}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-600 whitespace-nowrap">
                      {item.total_hours}
                    </td>
                  </tr>
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
          </table>
        </div>
        )}

       {/* Footer controls */}
        <div className="flex flex-col md:flex-row items-center justify-end mt-3 lg:mt-6 gap-3">
          {/* Pagination */}
          <div className="flex items-center gap-2">
            {classReportData?.data?.links?.map((link, index) => (
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
    </div>
  );
};

export default Page;
