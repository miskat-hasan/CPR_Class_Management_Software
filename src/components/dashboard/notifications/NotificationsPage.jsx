"use client";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useGetNotifications } from "@/hooks/api/dashboardApi";

const NotificationsPage = () => {
  const { data, isLoading } = useGetNotifications();

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px] ">
      <SectionTitle title={"Notifications"} />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black text-[14px] md:text-[16px] font-semibold">
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
              </thead>

              <tbody>
                {data?.data?.length > 0 ? (
                  data?.data?.map((item) => (
                    <tr
                      key={item?.id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 md:px-6 py-4 ">
                        {item?.title}
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        {item?.message}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {item?.type}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        
                        {new Date(item?.created_at).toLocaleString("en-US", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
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
        </div>
      )}
    </section>
  );
};

export default NotificationsPage;
