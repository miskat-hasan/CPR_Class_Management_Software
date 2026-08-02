"use client";
import SectionTitle from "@/components/common/SectionTitle";
import { SalesDashboard } from "@/components/dashboard/SalesDashboard";
import { useGetDailyVolumeReport } from "@/hooks/api/dashboardApi";

import React from "react";

const Page = () => {
  const { data, isLoading } = useGetDailyVolumeReport();
  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );


  return (
    <section className="flex flex-col gap-2.5 lg:gap-5">
      {/* <div className="flex flex-col gap-2.5 lg:gap-5">
        <SectionTitle title={"Shortcuts"} />
        <div className="w-[384px] h-[136px] p-[20px] bg-white dark:bg-black rounded-[20px] flex flex-col justify-between">
          <div className="flex gap-[20px] items-center">
            <div className="w-[45px] h-[45px] bg-[linear-gradient(180deg,_#FF9A9A_0%,_#B70000_100%)] rounded-full flex items-center justify-center">
              <DollarIcon />
            </div>
            <SubSectionTitle
              className={"text-[20px]"}
              subtitle={"Recent Funding Activity"}
            />
          </div>
          <Link
            className="flex items-center justify-between text-gray-500"
            href={""}
          >
            View Report <ArrowIcon />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-[15px] lg:gap-[30px]">
          <InfoCard
            icon={<DollarIcon />}
            title="Recent Funding Activity"
            linkText="View Report"
            linkHref="funding_reports"
          />
          <InfoCard
            icon={<CardIcon />}
            title="Recent Transactions"
            linkText="View Report"
            linkHref="funding_reports"
          />
        </div>
      </div> */}
      {isLoading ? (
         <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-5">
          {/* LEFT SIDE */}
          <div className="flex grow flex-col gap-2.5 xl:gap-5">
            {/* Title */}
            <Skeleton className="h-6 w-40" />

            {/* Chart Card */}
            <div className="w-full h-[350px] lg:h-[450px] bg-white dark:bg-black rounded-[20px] p-[20px]">
              <Skeleton className="w-full h-full rounded-[12px]" />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex w-full lg:w-[500px] flex-col gap-2.5 lg:gap-5">
            {/* Title */}
            <Skeleton className="h-6 w-32" />

            {/* Overview Card */}
            <div className="w-full h-auto lg:h-[450px] bg-white dark:bg-black rounded-[20px] p-[15px] lg:p-[20px] flex flex-col gap-[18px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                >
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-5">
          <div className="flex grow flex-col gap-2.5 xl:gap-5">
            <SectionTitle title={"Daily Volumes"} />
            <SalesDashboard data={data?.data} />
          </div>
          <div className="flex w-full lg:w-[500px] flex-col gap-2.5 lg:gap-5">
            <SectionTitle title={"Overview"} />
            <div className="w-full h-auto lg:h-[450px] bg-white dark:bg-black rounded-[20px] p-[15px] lg:p-[20px] flex flex-col gap-[10px] lg:gap-[20px]">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold">Total Transaction Count</p>
                <span className="text-[#969688] text-[12px]">
                  {data?.data?.overview?.total_transaction_count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold">
                  Total Transaction Volume
                </p>
                <span className="text-[#969688] text-[12px]">
                  {data?.data?.overview?.total_transaction_volume}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold">Last Transaction Date</p>
                <span className="text-[#969688] text-[12px]">
                  {data?.data?.overview?.last_transaction_date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold">Last Transaction Amount</p>
                <span className="text-[#969688] text-[12px]">
                  {data?.data?.overview?.last_transaction_amount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold">Last Transaction ID</p>
                <span className="text-[#969688] text-[12px]">
                  {data?.data?.overview?.last_transaction_id}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
