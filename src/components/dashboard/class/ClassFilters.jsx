"use client";

import { useState, useEffect } from "react";
import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/svg/SvgContainer";
import { IoClose } from "react-icons/io5";
import {
  getAllCourses,
  getAllInstructor,
  getAllLocation,
} from "@/hooks/api/dashboardApi";

const DATE_RANGE_OPTIONS = [
  { id: "last_30", name: "Last 30 days" },
  { id: "this_month", name: "This month" },
  { id: "last_month", name: "Last month" },
  { id: "this_year", name: "This year" },
  { id: "last_year", name: "Last year" },
  { id: "custom", name: "Custom range" },
];

function getDateRange(rangeId) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  switch (rangeId) {
    case "last_30": {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return { start: d.toISOString().split("T")[0], end: today };
    }
    case "this_month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      return { start, end: today };
    }
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split("T")[0];
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString()
        .split("T")[0];
      return { start, end };
    }
    case "this_year": {
      return { start: `${now.getFullYear()}-01-01`, end: today };
    }
    case "last_year": {
      const y = now.getFullYear() - 1;
      return { start: `${y}-01-01`, end: `${y}-12-31` };
    }
    default:
      return { start: null, end: null };
  }
}

export default function ClassFilters({ onSearch, onClear, isSearching }) {
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const { data: coursesData, isLoading: coursesLoading } = getAllCourses({
    type: "all",
  });
  const { data: instructorData, isLoading: instructorLoading } =
    getAllInstructor({ type: "all" });
  const { data: locationData, isLoading: locationLoading } = getAllLocation({
    type: "all",
  });

  // "All" option prepended to each list
  const ALL_OPTION = [{ id: "", name: "— All —" }];

  const courseOptions = [
    ...ALL_OPTION,
    ...(coursesData?.data ?? []).map(c => ({
      id: String(c.id),
      name: c.course_name,
    })),
  ];
  const instructorOptions = [
    ...ALL_OPTION,
    ...(instructorData?.data ?? []).map(u => ({
      id: String(u.id),
      name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.name,
    })),
  ];
  const locationOptions = [
    ...ALL_OPTION,
    ...(locationData?.data?.data ?? []).map(l => ({
      id: String(l.id),
      name: l.name,
    })),
  ];

  // Resolve dates from range selection
  const resolvedDates =
    dateRange === "custom"
      ? { start: customStart, end: customEnd }
      : getDateRange(dateRange);

  // Fire search automatically when any dropdown changes
  useEffect(() => {
    triggerSearch();
  }, [courseId, instructorId, locationId, dateRange, customStart, customEnd]);

  const triggerSearch = () => {
    onSearch({
      search: search || null,
      course_id: courseId || null,
      instructor_id: instructorId || null,
      location_id: locationId || null,
      start_date: resolvedDates.start || null,
      end_date: resolvedDates.end || null,
    });
  };

  const handleClear = () => {
    setSearch("");
    setCourseId("");
    setInstructorId("");
    setLocationId("");
    setDateRange("");
    setCustomStart("");
    setCustomEnd("");
    onClear();
  };

  const hasActiveFilters =
    search || courseId || instructorId || locationId || dateRange;

  return (
    <div className="bg-white dark:bg-black rounded-[16px] p-4 lg:p-6 flex flex-col gap-4">
      {/* Text search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && triggerSearch()}
          placeholder="Search by Class ID, instructor, course, location..."
          className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <Button
          type="button"
          onClick={triggerSearch}
          className="py-2 px-4 cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 text-sm shrink-0"
        >
          <SearchIcon />
          Search
        </Button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#343536] rounded-lg hover:bg-gray-200 dark:hover:bg-[#292b2c] transition cursor-pointer shrink-0"
          >
            <IoClose size={18} className="text-gray-600 dark:text-gray" />
          </button>
        )}
      </div>

      {/* Dropdown filters — onChange fires automatically */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Date Range */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Date Range
          </label>
          <CustomSelect
            value={dateRange}
            options={DATE_RANGE_OPTIONS}
            onChange={val => {
              setDateRange(val);
            }}
            placeholder="Any date"
          />
        </div>

        {/* Course */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Course
          </label>
          <CustomSelect
            value={courseId}
            options={courseOptions}
            isLoading={coursesLoading}
            onChange={val => setCourseId(val === "" ? "" : val)}
            placeholder="All courses"
          />
        </div>

        {/* Instructor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Instructor
          </label>
          <CustomSelect
            value={instructorId}
            options={instructorOptions}
            isLoading={instructorLoading}
            onChange={val => setInstructorId(val === "" ? "" : val)}
            placeholder="All instructors"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Location
          </label>
          <CustomSelect
            value={locationId}
            options={locationOptions}
            isLoading={locationLoading}
            onChange={val => setLocationId(val === "" ? "" : val)}
            placeholder="All locations"
          />
        </div>
      </div>

      {/* Custom date range inputs */}
      {dateRange === "custom" && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray whitespace-nowrap">
              From:
            </label>
            <input
              type="date"
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray whitespace-nowrap">
              To:
            </label>
            <input
              type="date"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}
