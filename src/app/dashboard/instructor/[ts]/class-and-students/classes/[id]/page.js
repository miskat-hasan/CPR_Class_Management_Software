"use client";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  getAllClient,
  getAllCourses,
  getAllInstructor,
  getAllLocation,
  getSingleClass,
  updateClass,
} from "@/hooks/api/dashboardApi";
import { LucideTrash2, X } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import Swal from "sweetalert2";

const Page = ({ params }) => {
  const { id } = params;

  const form = useForm({
    defaultValues: {
      course: null,
      client: null,
      location: null,
      instructor: null,
      assistants: [],
      // classId: "",
      price: "",
      totalHours: "",
      maxStudents: "",
      studentManikinRatio: "",
      closeRegistrationEarly: "",
      listing: false,
      publicNotes: "",
      internalNotes: "",
      classTimes: [{ date: "", timeFrom: "", timeTo: "" }],
    },
  });

  const {
    control,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "classTimes",
  });

  const { data: classData, isLoading: classDataLoading } = getSingleClass(id);

  const { data: coursesData, isLoading: coursesLoading } = getAllCourses();
  const { data: clientData, isLoading: clientDataLoading } = getAllClient();
  const { data: locationData, isLoading: locationDataLoading } =
    getAllLocation();
  const { data: instructorData, isLoading: instructorDataLoading } =
    getAllInstructor();

  const selectedAssistants = watch("assistants") || [];

  const convertTo24Hour = (time) => {
    if (!time) return "";

    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }

    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  useEffect(() => {
    if (
      classData?.data &&
      coursesData?.data?.data &&
      clientData?.data?.data &&
      locationData?.data?.data &&
      instructorData?.data?.data
    ) {
      const classInfo = classData.data;

      reset({
        course: classInfo?.course_id || null,
        client: classInfo?.client_id || null,
        location: classInfo?.location_id || null,
        instructor: classInfo?.instructor_id || null,
        classId: classInfo?.class_id || "",
        price: classInfo?.price || "",
        totalHours: classInfo?.total_hours || "",
        maxStudents: classInfo?.max_student || "",
        studentManikinRatio: classInfo?.ratio || "",
        closeRegistrationEarly: classInfo?.close_registration || "",
        listing: Boolean(classInfo?.listing),
        publicNotes: classInfo?.public_notes || "",
        internalNotes: classInfo?.internal_notes || "",
        assistants:
          classInfo?.assistants?.map((assistant) => assistant.id) || [],
        classTimes:
          classInfo?.class_times?.length > 0
            ? classInfo.class_times.map((time) => ({
                date: time.date || "",
                timeFrom: convertTo24Hour(time.from),
                timeTo: convertTo24Hour(time.to),
              }))
            : [{ date: "", timeFrom: "", timeTo: "" }],
      });
    }
  }, [
    reset,
    classData?.data,
    coursesData?.data?.data,
    clientData?.data?.data,
    instructorData?.data?.data,
    locationData?.data?.data,
  ]);

  // const dayOptions = [
  //   { id: "monday", name: "Monday" },
  //   { id: "tuesday", name: "Tuesday" },
  //   { id: "wednesday", name: "Wednesday" },
  //   { id: "thursday", name: "Thursday" },
  //   { id: "friday", name: "Friday" },
  //   { id: "saturday", name: "Saturday" },
  //   { id: "sunday", name: "Sunday" },
  // ];

  const { mutate, isPending } = updateClass();

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("id", params.id);
    formData.append("course_id", data.course);
    formData.append("client_id", data.client);
    formData.append("location_id", data.location);
    formData.append("instructor_id", data.instructor);
    // formData.append("class_id", data.classId);
    formData.append("price", data.price);
    formData.append("total_hours", data.totalHours);
    formData.append("max_student", data.maxStudents);
    formData.append("ratio", data.studentManikinRatio);
    formData.append("close_registration", data.closeRegistrationEarly);
    formData.append("listing", data.listing ? 1 : 0);
    formData.append("public_notes", data.publicNotes);
    formData.append("internal_notes", data.internalNotes);
    formData.append("training_site_id", 1);

    // assistants array
    // data.assistants.forEach((id, index) => {
    //   formData.append(`assistant_ids[]`, id);
    // });

    // classTimes array
    data.classTimes.forEach((item, index) => {
      formData.append(`class_times[${index}][date]`, item.date);
      formData.append(`class_times[${index}][from]`, item.timeFrom);
      formData.append(`class_times[${index}][to]`, item.timeTo);
    });

    mutate(formData, {
      onSuccess: (data) => {
        reset();
        toast.success(data?.message || "Class updated successfully");
      },
      onError: (err) => {
       toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  const handleAddClassTime = () => {
    if (fields.length < 7) {
      append({
        day: "",
        timeFrom: "",
        timeTo: "",
      });
    }
  };

  const handleRemoveClassTime = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleAddAssistant = (value) => {
    // Handle both cases: value could be an ID or an object
    const assistantId = typeof value === "object" ? value?.id : value;
    // Convert to number to ensure consistency
    const numericId = Number(assistantId);

    console.log("Adding assistant ID:", numericId);
    console.log("Current selected:", selectedAssistants);

    if (numericId && !selectedAssistants.includes(numericId)) {
      setValue("assistants", [...selectedAssistants, numericId]);
    }
  };

  const handleRemoveAssistant = (assistantId) => {
    setValue(
      "assistants",
      selectedAssistants.filter((id) => id !== assistantId),
    );
  };

  // Get available assistants (not already selected)
  const availableAssistants = instructorData?.data?.data?.filter(
    (instructor) => !selectedAssistants.includes(instructor.id),
  );

  return (
    <div className="flex flex-col gap-[10px] lg:gap-[20px]">
      <SectionTitle title={"Update a Class"} />
      <FormContainer
        form={form}
        onSubmit={onSubmit}
        className="bg-white dark:bg-black p-4 lg:p-6 rounded-lg shadow"
      >
        {/* Main form layout grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Controller
            name="course"
            control={control}
            rules={{ required: "Course is required" }}
            render={({ field }) => (
              <CustomSelect
                {...field}
                id="course"
                label="Course"
                placeholder="Course"
                isLoading={coursesLoading}
                options={coursesData?.data?.data}
                error={errors.course?.message}
                className="flex-1"
              />
            )}
          />
          {/* <FormInput name="classId" label="Class Id" placeholder="Class Id" /> */}
          <Controller
            name="client"
            control={control}
            rules={{ required: "Client is required" }}
            render={({ field }) => (
              <CustomSelect
                {...field}
                id="client"
                label={"Client"}
                placeholder="Client"
                isLoading={clientDataLoading}
                options={clientData?.data?.data}
                error={errors.client?.message}
                className={"flex-1"}
              />
            )}
          />
          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <CustomSelect
                {...field}
                id="location"
                label={"Location"}
                placeholder="Location"
                isLoading={locationDataLoading}
                options={locationData?.data?.data}
                error={errors.location?.message}
                className={"flex-1"}
              />
            )}
          />
          <Controller
            name="instructor"
            control={control}
            rules={{ required: "Instructor is required" }}
            render={({ field }) => (
              <CustomSelect
                {...field}
                id="instructor"
                label={"Instructor"}
                placeholder="Instructor"
                isLoading={instructorDataLoading}
                options={instructorData?.data?.data}
                error={errors.instructor?.message}
                className={"flex-1"}
              />
            )}
          />

          {/* Multiple Assistants Selection */}
          <div className="flex flex-col gap-2">
            {/* Dropdown to add more assistants */}
            <Controller
              name="assistantSelector"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="assistantSelector"
                  label={"Assistants"}
                  placeholder="Select assistant to add"
                  isLoading={instructorDataLoading}
                  options={availableAssistants}
                  onChange={(value) => {
                    if (value) {
                      handleAddAssistant(value);
                      field.onChange(""); // Reset selector
                    }
                  }}
                  value=""
                  className={"flex-1"}
                />
              )}
            />
            {errors.assistants && (
              <p className="text-red-500 text-sm">
                {errors.assistants.message}
              </p>
            )}
            {/* Selected Assistants Tags */}
            {selectedAssistants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedAssistants.map((assistantId) => {
                  const assistant = instructorData?.data?.data?.find(
                    (inst) => inst.id === assistantId,
                  );
                  return (
                    <div
                      key={assistantId}
                      className="inline-flex items-center gap-1 bg-neutral-200 text-neutral-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{assistant?.name || assistant?.username}</span>
                      <div
                        onClick={() => handleRemoveAssistant(assistantId)}
                        className="hover:bg-blue-200 rounded-full p-0.5 cursor-pointer"
                      >
                        <X className="size-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Class Times Section */}
          <div className="col-span-2 bg-neutral-50 border px-2 pt-2 pb-4 rounded-md">
            <h6 className="text-xl mb-1">Set Class Times</h6>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 mt-3">
                <div className="grid grid-cols-3 gap-4 flex-1">
                  {/* <Controller
                    name={`classTimes.${index}.day`}
                    control={control}
                    rules={{ required: "Day is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        label="Day"
                        placeholder="Select day"
                        options={dayOptions}
                        error={errors?.classTimes?.[index]?.day?.message}
                      />
                    )}
                  /> */}
                  <FormInput
                    name={`classTimes.${index}.date`}
                    label="Date"
                    placeholder="Date"
                    type="date"
                  />
                  <FormInput
                    name={`classTimes.${index}.timeFrom`}
                    label="From"
                    placeholder="from"
                    type="time"
                  />
                  <FormInput
                    name={`classTimes.${index}.timeTo`}
                    label="To"
                    placeholder="to"
                    type="time"
                  />
                </div>
                {fields.length > 1 && (
                  <div
                    onClick={() => handleRemoveClassTime(index)}
                    className="bg-neutral-200 p-2 -mb-6 rounded-md cursor-pointer hover:bg-neutral-300"
                  >
                    <LucideTrash2 className="size-4" />
                  </div>
                )}
              </div>
            ))}
            <div
              onClick={handleAddClassTime}
              className="mt-4 px-2 py-1.5 inline-flex items-center gap-1 border rounded-md text-sm bg-neutral-700 text-neutral-100 cursor-pointer hover:bg-neutral-600 shadow-sm"
            >
              <FaPlus className="size-3" />
              Add more
            </div>
          </div>

          {/* Pricing and Capacity Section */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormInput name="price" label="Price" placeholder="e.g., 100" />
              <FormInput
                name="totalHours"
                label="Total Hours"
                placeholder="e.g., 8"
              />
              <FormInput
                name="maxStudents"
                label="Max Students"
                placeholder="e.g., 25"
              />
              <div>
                <Controller
                  name="studentManikinRatio"
                  control={control}
                  rules={{ required: "Student/Manikin Ratio is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="studentManikinRatio"
                      label={"Student/Manikin Ratio"}
                      placeholder="Student Ratio"
                      options={[
                        { id: "1", name: "1:1" },
                        { id: "2", name: "2:1" },
                        { id: "3", name: "3:1" },
                        { id: "4", name: "4:1" },
                        { id: "5", name: "5:1" },
                        { id: "6", name: "6:1" },
                        { id: "7", name: "7:1" },
                        { id: "8", name: "8:1" },
                        { id: "9", name: "9:1" },
                      ]}
                      error={errors.studentManikinRatio?.message}
                      className={"flex-1"}
                    />
                  )}
                />
                <p className="text-xs text-gray-500 mt-1">if applicable</p>
              </div>
            </div>
          </div>

          <div>
            <FormInput
              name="closeRegistrationEarly"
              label="Close Registration Early"
              type="date"
            />
            <p className="text-xs text-gray-500 mt-1">
              days and hours before class start date
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <label className="leading-[1.45] font-medium text-sm sm:text-base text-gray-700">
              Listing
            </label>
            <div className="flex items-center gap-2">
              <input
                id="bidding-checkbox"
                type="checkbox"
                {...form.register("listing")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="bidding-checkbox"
                className="text-sm text-gray-600"
              >
                Include in the online class catalog
              </label>
            </div>
          </div>

          {/* Notes Section */}
          <div className="md:col-span-2">
            <FormTextarea name="publicNotes" label="Public Notes" />
          </div>
          <div className="md:col-span-2">
            <FormTextarea name="internalNotes" label="Internal Notes" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none"
          >
            {isPending ? "Updating..." : "Update Class"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default Page;
