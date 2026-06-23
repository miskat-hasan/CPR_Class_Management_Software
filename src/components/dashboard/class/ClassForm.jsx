"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import CustomSelect from "@/components/shared/form/CustomSelect";
import MultiSelect from "@/components/shared/form/MultiSelect";
import BackButton from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import { LucideTrash2, Upload, X } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import {
  getAllCourses,
  getAllClient,
  getAllInstructor,
  getAllLocation,
  getAllCertifyingBody,
} from "@/hooks/api/dashboardApi";
import Link from "next/link";
import { useParams } from "next/navigation";

const RATIO_OPTIONS = [
  { id: "1:1", name: "1:1" },
  { id: "1:2", name: "1:2" },
  { id: "1:3", name: "1:3" },
  { id: "1:4", name: "1:4" },
  { id: "1:5", name: "1:5" },
  { id: "1:6", name: "1:6" },
  { id: "1:7", name: "1:7" },
  { id: "1:8", name: "1:8" },
  { id: "1:9", name: "1:9" },
];

// Format instructor name for display
const formatName = user => {
  if (!user) return "";
  return (
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
    user.name ||
    `User #${user.id}`
  );
};

export default function ClassForm({
  defaultValues,
  onSubmit,
  isPending,
  isEdit = false,
  isPastClass = false,
}) {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);
  const [signatureFile, setSignatureFile] = useState(null);

  const form = useForm({
    defaultValues: defaultValues ?? {
      certifyingBody: "",
      course: "",
      client: "",
      location: "",
      instructor: "",
      assistants: [],
      price: "",
      totalHours: "",
      maxStudents: "",
      studentManikinRatio: "",
      closeRegistrationDays: "",
      closeRegistrationHours: "",
      listing: false,
      publicNotes: "",
      internalNotes: "",
      adminNotes: "",
      certificateIssued: "",
      certificateExpire: "",
      classTimes: [{ date: "", timeFrom: "", timeTo: "" }],
    },
  });

  const {
    control,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "classTimes",
  });

  const selectedCertifyingBody = watch("certifyingBody");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      if (defaultValues.existingDocuments) {
        setExistingDocs(defaultValues.existingDocuments);
      }
    }
  }, [defaultValues, reset]);

  // Data fetching — all with type=all
  const { data: certifyingData, isLoading: certifyingLoading } =
    getAllCertifyingBody({ type: "all" });
  const { data: coursesData, isLoading: coursesLoading } = getAllCourses({
    type: "all",
  });
  const { data: clientData, isLoading: clientLoading } = getAllClient({
    type: "all",
  });
  const { data: locationData, isLoading: locationLoading } = getAllLocation({
    type: "all",
  });
  const { data: instructorData, isLoading: instructorLoading } =
    getAllInstructor({ type: "all" });

  // Filter courses by selected certifying body (client-side)
  const allCourses = coursesData?.data ?? [];

  const filteredCourses = selectedCertifyingBody
    ? allCourses.filter(c => c.certifying_body?.name === selectedCertifyingBody)
    : allCourses;

  // Format instructor/client options
  const instructorOptions = (instructorData?.data ?? []).map(u => ({
    id: u.id,
    name: formatName(u),
  }));

  const clientOptions = (clientData?.data ?? []).map(u => ({
    id: u.id,
    name: formatName(u),
  }));

  const certifyingOptions = [
    ...(certifyingData?.data?.length > 0 ? [{ id: "", name: "— All —" }] : []),
    ...(certifyingData?.data ?? []).map(cb => ({
      id: cb.name,
      name: cb.name,
    })),
  ];

  const courseOptions = filteredCourses.map(c => ({
    id: c.id,
    name: c.course_name,
  }));

  const locationOptions = (locationData?.data?.data ?? []).map(l => ({
    id: l.id,
    name: l.name,
  }));

  // converts "10:00 AM" or "02:30 PM" → "10:00" or "14:30"
  const to24Hour = timeStr => {
    if (!timeStr) return "00:00";
    // already 24-hour (no AM/PM)
    if (!/AM|PM/i.test(timeStr)) return timeStr.trim();
    const [time, modifier] = timeStr.trim().split(/\s+/);
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier.toUpperCase() === "AM") {
      if (hours === 12) hours = 0;
    } else {
      if (hours !== 12) hours += 12;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const handleDocumentAdd = e => {
    const files = Array.from(e.target.files ?? []);
    setDocuments(prev => [...prev, ...files]);
    e.target.value = "";
  };

  const handleRemoveNewDoc = index => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = data => {
    const formData = new FormData();

    formData.append("course_certifying_body_id", data.certifyingBodyId ?? "");
    formData.append("course_id", data.course);
    formData.append("client_id", data.client ?? "");
    formData.append("location_id", data.location);
    formData.append("instructor_id", data.instructor);
    formData.append("price", data.price);
    formData.append("total_hours", data.totalHours);
    formData.append("max_student", data.maxStudents);
    formData.append("ratio", data.studentManikinRatio);
    formData.append(
      "close_registration_days",
      data.closeRegistrationDays ?? "",
    );
    formData.append(
      "close_registration_hours",
      data.closeRegistrationHours ?? "",
    );
    formData.append("listing", data.listing ? 1 : 0);
    formData.append("public_notes", data.publicNotes ?? "");
    formData.append("internal_notes", data.internalNotes ?? "");
    formData.append("admin_notes", data.adminNotes ?? "");
    formData.append("certificate_issued", data.certificateIssued ?? "");
    formData.append("certificate_expire", data.certificateExpire ?? "");

    // Assistants
    (data.assistants ?? []).forEach(id =>
      formData.append("assistant_ids[]", id),
    );

    // Class times
    (data.classTimes ?? []).forEach((item, i) => {
      formData.append(`class_times[${i}][date]`, item.date);
      formData.append(`class_times[${i}][from]`, item.timeFrom);
      formData.append(`class_times[${i}][to]`, item.timeTo);
    });

    // Documents (multiple)
    documents.forEach(file => formData.append("documents[]", file));

    // Signature (past class only)
    if (isPastClass && signatureFile) {
      formData.append("signature", signatureFile);
    }

    onSubmit(formData);
  };

  return (
    <FormContainer form={form} onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Close registration status */}
        {isEdit &&
          (() => {
            const days = Number(defaultValues?.closeRegistrationDays ?? 0);
            const hours = Number(defaultValues?.closeRegistrationHours ?? 0);
            const firstDate = defaultValues?.classTimes?.[0]?.date;
            if (!firstDate) return null;

            const classStart = new Date(
              `${firstDate}T${to24Hour(defaultValues?.classTimes?.[0]?.from)}`,
            );
            const cutoff = new Date(classStart);
            cutoff.setDate(cutoff.getDate() - days);
            cutoff.setHours(cutoff.getHours() - hours);
            const isClosed = new Date() > cutoff;

            return isClosed ? (
              <div className="md:col-span-2">
                <p className="text-sm text-red-500 font-medium">
                  Registration for this class is closed.
                </p>
              </div>
            ) : (
              <div className="md:col-span-2">
                <p className="text-sm font-medium dark:text-gray">
                  Registration Link:{" "}
                  <Link
                    href={window.origin + "/enroll/" + id}
                    className="underline text-brown"
                    target="_blank"
                  >
                    {window.origin + "/enroll/" + id}
                  </Link>
                </p>
              </div>
            );
          })()}

        {/* Certifying Body — filters courses client-side */}
        <div className="md:col-span-2">
          <Controller
            name="certifyingBody"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Course Certifying Body (filter)"
                placeholder="Filter by certifying body"
                isLoading={certifyingLoading}
                options={certifyingOptions}
              />
            )}
          />
        </div>

        {/* Course */}
        <Controller
          name="course"
          control={control}
          rules={{ required: "Course is required" }}
          render={({ field, fieldState }) => (
            <CustomSelect
              {...field}
              label="Course"
              placeholder="Select course"
              isLoading={coursesLoading}
              options={courseOptions}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Client */}
        <Controller
          name="client"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Client"
              placeholder="Select client"
              isLoading={clientLoading}
              options={clientOptions}
            />
          )}
        />

        {/* Location */}
        <Controller
          name="location"
          control={control}
          rules={{ required: "Location is required" }}
          render={({ field, fieldState }) => (
            <CustomSelect
              {...field}
              label="Location"
              placeholder="Select location"
              isLoading={locationLoading}
              options={locationOptions}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Instructor */}
        <Controller
          name="instructor"
          control={control}
          rules={{ required: "Instructor is required" }}
          render={({ field, fieldState }) => (
            <CustomSelect
              {...field}
              label="Instructor"
              placeholder="Select instructor"
              isLoading={instructorLoading}
              options={instructorOptions}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Assistants — MultiSelect */}
        <div className="md:col-span-2">
          <Controller
            name="assistants"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                label="Assistants"
                placeholder="Search and select assistants..."
                isLoading={instructorLoading}
                options={instructorOptions}
              />
            )}
          />
        </div>

        {/* Class Times */}
        <div className="md:col-span-2 bg-neutral-50 dark:bg-dark border dark:border-gray-700 px-3 pt-3 pb-4 rounded-md">
          <h6 className="text-base font-semibold mb-2 dark:text-gray">
            Set Class Times
          </h6>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-end gap-2 mt-3 border-b dark:border-gray-700 pb-3"
            >
              <div className="grid grid-cols-3 gap-3 flex-1">
                <FormInput
                  name={`classTimes.${index}.date`}
                  label="Date"
                  type="date"
                />
                <FormInput
                  name={`classTimes.${index}.timeFrom`}
                  label="From"
                  type="time"
                />
                <FormInput
                  name={`classTimes.${index}.timeTo`}
                  label="To"
                  type="time"
                />
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 mb-0.5 bg-neutral-200 dark:bg-gray-700 rounded-md hover:bg-red-100 transition cursor-pointer"
                >
                  <LucideTrash2 className="size-4 text-gray-600 dark:text-gray" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              fields.length < 14 &&
              append({ date: "", timeFrom: "", timeTo: "" })
            }
            className="mt-3 px-3 py-1.5 inline-flex items-center gap-1.5 border rounded-md text-sm bg-neutral-700 dark:bg-gray-800 text-neutral-100 cursor-pointer hover:bg-neutral-600 w-fit"
          >
            <FaPlus className="size-3" /> Add more
          </button>
        </div>

        {/* Price + Hours + Max Students + Ratio */}
        <FormInput
          name="price"
          type="number"
          label="Price"
          placeholder="e.g. 100"
        />
        <FormInput
          name="totalHours"
          type="number"
          label="Total Hours"
          placeholder="e.g. 8"
        />
        <FormInput
          name="maxStudents"
          type="number"
          label="Max Students"
          placeholder="e.g. 25"
        />
        <Controller
          name="studentManikinRatio"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Student/Manikin Ratio"
              placeholder="Select ratio"
              options={RATIO_OPTIONS}
            />
          )}
        />

        {/* Close Registration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Close Registration Early
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="number"
              {...register("closeRegistrationDays")}
              placeholder="0"
              className="w-20 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <span className="text-sm dark:text-gray">days and</span>
            <input
              type="number"
              {...register("closeRegistrationHours")}
              placeholder="0"
              className="w-20 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <span className="text-sm dark:text-gray">
              hours before class start date
            </span>
          </div>
        </div>

        {/* Listing */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Listing
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray">
            <input
              type="checkbox"
              {...register("listing")}
              className="accent-brown"
            />
            Include in the online class catalog
          </label>
        </div>

        {/* Certificate dates */}
        <FormInput
          name="certificateIssued"
          label="Certificate Issued On"
          type="date"
        />
        <FormInput
          name="certificateExpire"
          label="Certificate Expires On"
          type="date"
        />

        {/* Notes */}
        <div className="md:col-span-2">
          <FormTextarea name="publicNotes" label="Public Notes" />
        </div>
        <div className="md:col-span-2">
          <FormTextarea name="internalNotes" label="Internal Notes" />
        </div>
        <div className="md:col-span-2">
          <FormTextarea name="adminNotes" label="Admin Notes" />
        </div>

        {/* Documents — multiple upload */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Documents
          </label>

          {/* Existing docs */}
          {existingDocs.length > 0 && (
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Existing files:
              </p>
              {existingDocs.map((doc, i) => (
                <a
                  key={i}
                  href={`${process.env.NEXT_PUBLIC_SITE_URL}/${doc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brown hover:underline"
                >
                  {doc.split("/").pop()}
                </a>
              ))}
            </div>
          )}

          {/* New files */}
          {documents.length > 0 && (
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                New files to upload:
              </p>
              {documents.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                >
                  <span className="truncate max-w-xs">{file.name}</span>
                  <button type="button" onClick={() => handleRemoveNewDoc(i)}>
                    <X
                      size={12}
                      className="hover:text-red-500 cursor-pointer"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray cursor-pointer hover:bg-gray-50 dark:hover:bg-dark w-fit">
            <Upload size={14} />
            Select files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleDocumentAdd}
            />
          </label>
        </div>

        {/* Instructor Signature — past class only */}
        {isPastClass && (
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray">
              Instructor Signature
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              I verify that this information is accurate and truthful and that
              it can be confirmed. This course was taught in accordance with the
              manufacturer's standards.
            </p>
            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray cursor-pointer hover:bg-gray-50 dark:hover:bg-dark w-fit">
              <Upload size={14} />
              {signatureFile ? signatureFile.name : "Upload signature"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => setSignatureFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {signatureFile && (
              <button
                type="button"
                onClick={() => setSignatureFile(null)}
                className="text-xs text-red-500 hover:underline w-fit"
              >
                Remove
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="md:col-span-2 flex justify-end gap-3 mt-3">
          <BackButton />
          <Button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? "Saving..."
              : isEdit
                ? "Update Class"
                : "Schedule Class"}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
}
