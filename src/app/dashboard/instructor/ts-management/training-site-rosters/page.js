"use client";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
} from "@/components/common/TableElement";
import { useGetAllRosters } from "@/hooks/api/dashboardApi";

const Page = () => {
  const { data, isLoading } = useGetAllRosters();

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title={"Training Site Rosters"} />

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">Finalized</th>
                  <th className="px-3 sm:px-6 py-3">Training Site</th>
                  <th className="px-3 sm:px-6 py-3">Class</th>
                  <th className="px-3 sm:px-6 py-3">Instructor</th>
                  <th className="px-3 sm:px-6 py-3 text-center">Student</th>
                </tr>
              </TableHead>

              <tbody>
                {data?.data?.length > 0 ? (
                  data?.data?.map((item) => (
                    <TableBodyRow key={item.id}>
                      <td className="px-3 sm:px-6 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {item?.finalized_at?.split(" ")?.[0] ?? "—"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-800 dark:text-gray-200 font-medium">
                        {item.training_site}
                      </td>
                      <td className="px-3 sm:px-6 py-3 dark:text-gray-300">
                        {item?.course_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 dark:text-gray-300">
                        {item?.instructor_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap text-center">
                        {item?.enrolled_students}
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-3 sm:py-6 text-gray-500 dark:text-gray-400 italic"
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
