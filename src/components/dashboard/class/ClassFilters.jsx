"use client";

import { useForm, Controller } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
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

export default function ClassFilters({ onSearch, onClear, isSearching }) {
  const form = useForm({
    defaultValues: {
      class_id: "",
      course_id: "",
      instructor_id: "",
      location_id: "",
    },
  });
  const { control, reset } = form;

  const { data: coursesData, isLoading: coursesLoading } = getAllCourses();
  const { data: instructorData, isLoading: instructorLoading } =
    getAllInstructor();
  const { data: locationData, isLoading: locationLoading } = getAllLocation();

  const instructorOptions = (instructorData?.data?.data ?? []).map(u => ({
    id: u.id,
    name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.name,
  }));

  const courseOptions = (coursesData?.data?.data ?? []).map(c => ({
    id: c.id,
    name: c.course_name,
  }));

  const locationOptions = (locationData?.data?.data ?? []).map(l => ({
    id: l.id,
    name: l.name,
  }));

  const onSubmit = data => {
    onSearch({
      class_id: data.class_id || null,
      course_id: data.course_id || null,
      instructor_id: data.instructor_id || null,
      location_id: data.location_id || null,
    });
  };

  const handleClear = () => {
    reset();
    onClear();
  };

  return (
    <FormContainer form={form} onSubmit={onSubmit}>
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-white dark:bg-black rounded-[16px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
          <FormInput
            name="class_id"
            label="Class ID"
            placeholder="Search by ID"
          />

          <Controller
            name="course_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Course"
                placeholder="All courses"
                isLoading={coursesLoading}
                options={courseOptions}
              />
            )}
          />

          <Controller
            name="instructor_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Instructor"
                placeholder="All instructors"
                isLoading={instructorLoading}
                options={instructorOptions}
              />
            )}
          />

          <Controller
            name="location_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Location"
                placeholder="All locations"
                isLoading={locationLoading}
                options={locationOptions}
              />
            )}
          />

          <div className="flex items-end gap-2">
            <Button
              type="submit"
              disabled={isSearching}
              className="py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 text-sm"
            >
              <SearchIcon />
              {isSearching ? "Searching..." : "Search"}
            </Button>
            {isSearching && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#343536] rounded-lg hover:bg-gray-200 dark:hover:bg-[#292b2c] transition cursor-pointer"
              >
                <IoClose size={18} className="text-gray-600 dark:text-gray" />
              </button>
            )}
          </div>
        </div>
      </div>
    </FormContainer>
  );
}
