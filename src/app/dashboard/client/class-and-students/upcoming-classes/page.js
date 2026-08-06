// src/app/dashboard/client/class-and-students/upcoming-classes/page.js
"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import StudentClassTable from "@/components/dashboard/class-and-students/StudentClassTable";
import { getClientUpcomingClasses } from "@/hooks/api/dashboardApi";

export default function ClientUpcomingClassesPage() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const { data, isLoading } = getClientUpcomingClasses(page, perPage);

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title="Upcoming Classes" />

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All Lists" />
        <StudentClassTable
          data={data?.data?.data}
          isLoading={isLoading}
          links={data?.data?.links}
          setPage={setPage}
          basePath="upcoming-classes"
        />
      </div>
    </div>
  );
}
