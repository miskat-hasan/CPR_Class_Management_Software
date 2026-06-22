"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import ClassFilters from "@/components/dashboard/class/ClassFilters";
import ClassTable from "@/components/dashboard/class/ClassTable";
import { getAllPastClasses, searchClasses } from "@/hooks/api/dashboardApi";

export default function PastClassesPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState(null);

  const {
    data: pastData,
    isLoading: pastLoading,
    refetch,
  } = getAllPastClasses(page, perPage);

  const isSearchActive =
    filters && Object.values(filters).some(value => value !== null);

  const { data: searchData, isLoading: searchLoading } = searchClasses({
    enabled: isSearchActive,
    type: "past",
    courseId: filters?.course_id,
    instructorId: filters?.instructor_id,
    locationId: filters?.location_id,
    classId: filters?.class_id,
    search: filters?.search,
    startDate: filters?.start_date,
    endDate: filters?.end_date,
  });

  const tableData = isSearchActive
    ? searchData?.data?.data
    : pastData?.data?.data;
  const tableLoading = isSearchActive ? searchLoading : pastLoading;
  const tableLinks = isSearchActive
    ? searchData?.data?.links
    : pastData?.data?.links;

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title="Past Classes" />

      <ClassFilters
        onSearch={f => {
          setFilters(f);
          setPage(1);
        }}
        onClear={() => setFilters(null)}
        isSearching={isSearchActive}
      />

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All Lists" />
        <ClassTable
          data={tableData}
          isLoading={tableLoading}
          links={tableLinks}
          setPage={setPage}
          basePath="past-classes"
          onRefetch={refetch}
        />
      </div>
    </div>
  );
}
