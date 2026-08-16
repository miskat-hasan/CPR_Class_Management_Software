// src/app/dashboard/client/class-and-students/past-classes/page.js
"use client";

import { useState } from "react";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import StudentClassTable from "@/components/dashboard/class-and-students/StudentClassTable";
import { getClientPastClasses } from "@/hooks/api/dashboardApi";

export default function ClientPastClassesPage() {
  const [page, setPage] = useSiteAwarePagination();
  const [perPage] = useState(10);

  const { data, isLoading } = getClientPastClasses(page, perPage);

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title="Past Classes" />

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All Lists" />
        <StudentClassTable
          data={data?.data?.data}
          isLoading={isLoading}
          links={data?.data?.links}
          setPage={setPage}
          basePath="past-classes"
        />
      </div>
    </div>
  );
}
