"use client";
import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { useGetSingleTCProductOrder } from "@/hooks/api/dashboardApi";
import Link from "next/link";

const Page = ({ params }) => {
  const { id } = params;

  const { data, isLoading } = useGetSingleTCProductOrder(id);
  const orderDetails = data?.data;

  const Skeleton = (
    <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px] animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
        {/* Left Column */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="mt-4 overflow-x-auto">
        <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
        <div className="w-full border border-gray-100 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 h-12 w-full border-b border-gray-100"></div>
          {/* Table Rows */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex border-b border-gray-50 p-4 gap-4">
              <div className="h-4 w-full bg-gray-50 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section Skeleton */}
      <div className="p-[13px] border border-gray-100 rounded-[14px] flex flex-col md:flex-row items-center gap-[12px] lg:gap-[24px]">
        <div className="h-[45px] w-full max-w-[400px] bg-gray-100 rounded-md"></div>
        <div className="h-[45px] w-32 bg-gray-200 rounded-md"></div>
      </div>

      {/* Footer Button */}
      <div className="flex justify-end">
        <div className="h-10 w-24 bg-gray-100 rounded-md"></div>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SectionTitle title={"Order Details"} />

        {/* Grid Layout */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
            <div className="space-y-3">
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Order Date:
                </span>{" "}
                <span className="text-sm">
                  {new Date(orderDetails?.created_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Training Site:
                </span>{" "}
                <span className="text-sm">
                  {orderDetails?.training_site?.training_center_name}
                </span>
              </div>
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Associated Class:
                </span>{" "}
                <span className="text-sm">
                  {orderDetails?.associated_class}
                </span>
              </div>
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Last Update:
                </span>{" "}
                <span className="text-sm">
                  {new Date(
                    orderDetails?.activity_logs?.at(-1)?.updated_at,
                  ).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Payment Method:
                </span>{" "}
                <span className="text-sm">
                  {orderDetails?.type
                    .split("_")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(" ")}
                </span>
              </div>
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Paid:
                </span>{" "}
                <span className="text-sm">
                  {orderDetails?.is_paid ? "Yes" : "No"}
                </span>
              </div>

              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Order Total:
                </span>{" "}
                <span className="text-sm">${orderDetails?.total_amount}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Name:
                </span>{" "}
                <span className="text-sm">{orderDetails?.first_name}</span>{" "}
                <span className="text-sm">{orderDetails?.last_name}</span>
              </div>
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Address:
                </span>{" "}
                <span className="text-sm">{orderDetails?.address_1}</span>
                {", "}
                <span className="text-sm">{orderDetails?.address_2}</span>
                {", "}
                <span className="text-sm">{orderDetails?.city}</span>
                {", "}
                <span className="text-sm">{orderDetails?.state}</span>
                {", "}
                <span className="text-sm">{orderDetails?.postal_code}</span>
              </div>
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Email Address:
                </span>{" "}
                <span className="text-sm">{orderDetails?.email}</span>
              </div>
              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Phone Number:
                </span>{" "}
                <span className="text-sm">{orderDetails?.phone}</span>
              </div>

              <div>
                <span className="leading-[1.45] font-medium text-base text-gray-700">
                  Comments:
                </span>{" "}
                <span className="text-sm">{orderDetails?.notes}</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <p className="leading-[1.45] font-medium text-base text-gray-700 mb-2">
              Products:
            </p>
            <table className="min-w-full text-sm text-left text-gray-700 border">
              <thead className="bg-gray-50 text-black text-[14px] md:text-[16px] font-semibold">
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">#</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Product
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Name</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Price</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.items?.map((item) => (
                  <tr
                    key={item?.id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {item?.product_order_id}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {item?.product_id}
                    </td>
                    <td className="px-3 md:px-6 py-4">{item?.product?.name}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      ${item?.product?.price}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {item?.quantity}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      ${item?.product?.price * item?.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            asChild={true}
            className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
          >
            <Link href={"../ts_product_orders"}>Back</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
            <h5 className="leading-[1.45] font-medium text-base lg:text-xl text-gray-700 mb-2">
              Activity Log
            </h5>
            <table className="min-w-full text-sm text-left text-gray-700 border">
              <thead className="bg-gray-50 text-black text-[14px] md:text-[16px] font-semibold">
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">User</th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Entry
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.activity_logs?.map((item) => (
                  <tr
                    key={item?.id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {new Date(item?.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {item?.user?.name}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                      {item?.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </>
  );
};

export default Page;
