// src/components/enrollment/Schedule.jsx
"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, MapPin, Clock, Users, X } from "lucide-react";
import CustomSelect from "@/components/shared/form/CustomSelect";
import CustomInput from "@/components/shared/form/CustomInput";
import { TableFooter } from "@/components/common/TableElement";
import {
  getAllCourses,
  getAllInstructor,
  getAllLocation,
  useGetCourseSchedule,
} from "@/hooks/api/dashboardApi";

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmt = v => parseFloat(v ?? 0).toFixed(2);

const seatsLeft = cls =>
  Math.max(0, (cls.max_student ?? 0) - (cls.enrollments_count ?? 0));

const stripInlineColors = html =>
  html
    ?.replace(/background-color:\s*[^;]+;?/g, "")
    ?.replace(/color:\s*[^;]+;?/g, "");

// ─── Expandable HTML block (see more / see less) ──────────────────────────────

const ExpandableHtml = ({ html, className = "", collapsedHeight = 110 }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = node => {
    if (node && !expanded) {
      setOverflowing(node.scrollHeight > collapsedHeight + 4);
    }
  };

  if (!html) return null;

  return (
    <div>
      <div
        ref={ref}
        className={`${className} overflow-hidden transition-[max-height] duration-300`}
        style={{ maxHeight: expanded ? "none" : `${collapsedHeight}px` }}
        dangerouslySetInnerHTML={{ __html: stripInlineColors(html) }}
      />
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="mt-1.5 text-xs font-medium text-red-600 hover:underline cursor-pointer"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

// ─── Filter bar ───────────────────────────────────────────────────────────────

const FilterBar = ({ filters, onChange, onClear, onApply, courses, hiddenFilters, onClearCourseFilter }) => {
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
      name: u.name || `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
    })),
  ];
  const locationOptions = [
    ...ALL_OPTION,
    ...(locationData?.data ?? []).map(l => ({
      id: String(l.id),
      name: l.name,
    })),
  ];

  const hasFilters = Object.entries(filters).some(
    ([k, v]) => k !== "page" && v !== "",
  );

  const showCourseFilter = !hiddenFilters.course_id;
  const showInstructorFilter = !hiddenFilters.instructor_id;
  const showLocationFilter = !hiddenFilters.location_id;

  const lockedCourseId = hiddenFilters.course_id;

  return (
    <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden mb-5 mt-10">
      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
        <CustomInput
          id="schedule-search"
          placeholder="Search Classes"
          value={filters.search}
          onChange={v => onChange("search", v)}
        />
      </div>

      {/* Filter rows */}
      <div className="divide-y divide-gray-200 dark:divide-zinc-700 bg-white dark:bg-black">
        {showLocationFilter && (
          <div className="px-4 py-3">
            <CustomSelect
              label="Filter scheduled classes by location:"
              placeholder="All Locations"
              value={filters.location_id}
              onChange={v => onChange("location_id", v)}
              options={locationOptions}
            />
          </div>
        )}

        {showCourseFilter ? (
          <div className="px-4 py-3">
            <CustomSelect
              label="Filter scheduled classes by course type:"
              placeholder="All Courses"
              value={filters.course_id}
              onChange={v => onChange("course_id", v)}
              options={courseOptions}
            />
          </div>
        ) : (
          lockedCourseId && (
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Filtered by course
              </span>
              <button
                type="button"
                onClick={onClearCourseFilter}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="size-3.5" />
                Clear Course Filter
              </button>
            </div>
          )
        )}

        {showInstructorFilter && (
          <div className="px-4 py-3">
            <CustomSelect
              label="Filter scheduled classes by instructor:"
              placeholder="All Instructors"
              value={filters.instructor_id}
              onChange={v => onChange("instructor_id", v)}
              options={instructorOptions}
            />
          </div>
        )}

        <div className="px-4 py-3 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Filter scheduled classes by date or start time:
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <CustomInput
              id="schedule-date"
              type="date"
              value={filters.date}
              onChange={v => onChange("date", v)}
              className="w-40"
            />
            <span className="text-sm text-gray-400 dark:text-gray-500 pb-2.5">
              between
            </span>
            <CustomInput
              id="schedule-from-time"
              type="time"
              value={filters.from_time}
              onChange={v => onChange("from_time", v)}
              className="w-32"
            />
            <span className="text-sm text-gray-400 dark:text-gray-500 pb-2.5">
              and
            </span>
            <CustomInput
              id="schedule-to-time"
              type="time"
              value={filters.to_time}
              onChange={v => onChange("to_time", v)}
              className="w-32"
            />
          </div>
        </div>

        <div className="px-4 py-3 flex items-center justify-end gap-2">
          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <X className="size-3.5" />
              Clear Filters
            </button>
          )}
          <button
            type="button"
            onClick={onApply}
            className="px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition cursor-pointer font-medium"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Class button ─────────────────────────────────────────────────────────────

const ClassButton = ({ cls }) => {
  const seats = seatsLeft(cls);
  const origin = typeof window !== "undefined" ? window.origin : "";
  const href = `${origin}/enroll/${cls.id}`;

  const times = (cls.class_times ?? [])
    .map(t => `${t.date} ${t.from} – ${t.to}`)
    .join(" | ");

  const loc = cls.location;
  const address =
    [
      loc?.address_1,
      loc?.address_2,
      loc?.city,
      loc?.state,
      loc?.zip,
      loc?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    loc?.name ||
    cls.location_name ||
    "—";

  const isFull = seats <= 0;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border rounded-md px-4 py-3 text-sm transition ${
        isFull
          ? "border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 cursor-not-allowed opacity-60 pointer-events-none"
          : "border-gray-300 dark:border-zinc-700 hover:border-red-400 hover:bg-red-50 dark:hover:bg-zinc-800 cursor-pointer"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-red-600 font-medium">
          <Clock className="size-3.5 shrink-0 mt-0.5" />
          <span>{times || "—"}</span>
        </div>
        <span className="font-semibold text-gray-800 dark:text-white shrink-0">
          ${fmt(cls.price)}
        </span>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin className="size-3 shrink-0" />
          {address}
        </span>
        <span
          className={`flex items-center gap-1 font-medium ${
            isFull ? "text-red-500" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <Users className="size-3 shrink-0" />
          {isFull ? "Full" : `${seats} seat${seats !== 1 ? "s" : ""} left`}
        </span>
      </div>
    </a>
  );
};

// ─── Course accordion row ─────────────────────────────────────────────────────

const CourseAccordion = ({ course, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const imgSrc = course.image?.image?.startsWith("http")
    ? course.image.image
    : `${process.env.NEXT_PUBLIC_SITE_URL}/${course.image?.image}`;

  return (
    <div className="border border-gray-200 dark:border-zinc-700 rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-900 transition text-left cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          {course.image?.image && (
            <img
              src={imgSrc}
              alt={course.course_name}
              className="size-8 object-cover rounded shrink-0"
            />
          )}
          <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">
            {course.certifying_body?.name && (
              <span className="text-gray-500 dark:text-gray-400 font-normal">
                ({course.certifying_body.name}){" "}
              </span>
            )}
            {course.course_name}
          </p>
        </div>
        {open ? (
          <ChevronUp className="size-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="size-4 text-gray-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-black px-4 py-4 flex flex-col gap-4">
          {course.description && (
            <ExpandableHtml
              html={course.description}
              collapsedHeight={90}
              className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm leading-relaxed
                [&_ol]:list-decimal [&_ol]:pl-5
                [&_li[data-list=bullet]]:list-disc [&_li[data-list=bullet]]:ml-6"
            />
          )}

          {course.class_details?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {course.class_details.map(cls => (
                <ClassButton key={cls.id} cls={cls} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              No upcoming classes.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Schedule component ──────────────────────────────────────────────────

const EMPTY_FILTERS = {
  search: "",
  course_id: "",
  location_id: "",
  instructor_id: "",
  date: "",
  from_time: "",
  to_time: "",
};

const TRAINING_SITE_ID = 1;

const Schedule = ({
  data,
  isLoading,
  filters,
  setFilters,
  appliedFilters,
  setAppliedFilters,
  page,
  setPage,
  hiddenFilters,
  onClearCourseFilter,
}) => {
  const courses = data?.data?.courses?.data ?? [];
  const instructors = data?.data?.instructors ?? [];
  const links = data?.data?.courses?.links ?? [];
  const perPage = data?.data?.courses?.per_page ?? 10;
  const settings = data?.data?.settings;

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
  };

  return (
    <div>
      {/* Schedule page intro text — collapsible */}
      {settings?.schedule_page_text_html && (
        <ExpandableHtml
          html={settings.schedule_page_text_html}
          collapsedHeight={800}
          className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-xs leading-relaxed mb-5
            [&_ol]:list-decimal [&_ol]:pl-5
            [&_li[data-list=bullet]]:list-disc [&_li[data-list=bullet]]:ml-6"
        />
      )}

      <FilterBar
        filters={filters}
        onChange={handleChange}
        onApply={handleApply}
        onClear={handleClear}
        courses={courses}
        instructors={instructors}
        hiddenFilters={hiddenFilters}
        onClearCourseFilter={onClearCourseFilter}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-md"
            />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="flex flex-col gap-2">
          {courses.map((course, i) => (
            <CourseAccordion
              key={course.id}
              course={course}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500 italic text-sm">
          No classes found matching your filters.
        </div>
      )}

      {links.filter(l => l.url).length > 0 && (
        <TableFooter
          Links={links}
          perPage={perPage}
          setPage={setPage}
          setPerPage={() => {}}
        />
      )}
    </div>
  );
};

export { EMPTY_FILTERS, TRAINING_SITE_ID };
export default Schedule;
