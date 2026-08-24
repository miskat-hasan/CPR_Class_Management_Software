"use client";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
} from "@/components/common/TableElement";
import { useGetNotifications } from "@/hooks/api/dashboardApi";

const NotificationsPage = () => {
  const { data, isLoading } = useGetNotifications();

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title={"Notifications"} />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Title
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Message</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Created At</th>
                </tr>
              </TableHead>

              <tbody>
                {data?.data?.length > 0 ? (
                  data?.data?.map((item) => (
                    <TableBodyRow key={item?.id}>
                      <td className="px-3 md:px-6 py-4 font-medium dark:text-white">
                        {item?.title}
                      </td>
                      <td className="px-3 md:px-6 py-4 dark:text-gray-300">
                        {item?.message}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap dark:text-gray-300">
                        {item?.type}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {new Date(item?.created_at).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </section>
  );
};

export default NotificationsPage;
