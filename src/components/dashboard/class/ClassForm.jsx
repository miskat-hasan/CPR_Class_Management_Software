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

const formatName = user => {
  if (!user) return "";
  return (
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
    user.name ||
    `User #${user.id}`
  );
};

// "10:00 AM" → "10:00"  |  "14:30" → "14:30"
const to24Hour = timeStr => {
  if (!timeStr) return "00:00";
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

// "HH:MM" → minutes since midnight
const timeToMinutes = t => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

// Sum hours across all class time rows
const computeTotalHours = classTimes => {
  if (!Array.isArray(classTimes) || classTimes.length === 0) return "";
  let totalMinutes = 0;
  for (const row of classTimes) {
    const from = timeToMinutes(to24Hour(row.timeFrom ?? row.from ?? ""));
    const to = timeToMinutes(to24Hour(row.timeTo ?? row.to ?? ""));
    const diff = to - from;
    if (diff > 0) totalMinutes += diff;
  }
  if (totalMinutes === 0) return "";
  // Return as decimal hours, e.g. 90 min → "1.5"
  const hours = totalMinutes / 60;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(2);
};

// Last date among all class time rows (YYYY-MM-DD)
const computeLastDate = classTimes => {
  if (!Array.isArray(classTimes) || classTimes.length === 0) return "";
  const dates = classTimes
    .map(r => r.date)
    .filter(Boolean)
    .sort();
  return dates[dates.length - 1] ?? "";
};

// Add 2 years to a YYYY-MM-DD string
const addTwoYears = dateStr => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().slice(0, 10);
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
  const classTimes = watch("classTimes");

  // ── Auto-compute totalHours, certificateIssued, certificateExpire ──────────
  useEffect(() => {
    const totalHours = computeTotalHours(classTimes);
    const lastDate = computeLastDate(classTimes);
    const expireDate = addTwoYears(lastDate);

    setValue("totalHours", totalHours, { shouldDirty: false });
    setValue("certificateIssued", lastDate, { shouldDirty: false });
    setValue("certificateExpire", expireDate, { shouldDirty: false });
  }, [JSON.stringify(classTimes), setValue]);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      if (defaultValues.existingDocuments)
        setExistingDocs(defaultValues.existingDocuments);
    }
  }, [defaultValues, reset]);

  // Data fetching
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

  const allCourses = coursesData?.data ?? [];
  const filteredCourses = selectedCertifyingBody
    ? allCourses.filter(c => c.certifying_body?.id == selectedCertifyingBody)
    : allCourses;

  const instructorOptions = (instructorData?.data ?? []).map(u => ({
    id: u.id,
    name: formatName(u),
  }));
  const clientOptions = (clientData?.data ?? []).map(u => ({
    id: u.id,
    name: formatName(u),
  }));
  const courseOptions = filteredCourses.map(c => ({
    id: c.id,
    name: c.course_name,
  }));
  const locationOptions = (locationData?.data?.data ?? []).map(l => ({
    id: l.id,
    name: l.name,
  }));

  const certifyingOptions = [
    ...(certifyingData?.data?.length > 0 ? [{ id: "", name: "— All —" }] : []),
    ...(certifyingData?.data ?? []).map(cb => ({ id: cb.id, name: cb.name })),
  ];

  const handleDocumentAdd = e => {
    setDocuments(prev => [...prev, ...Array.from(e.target.files ?? [])]);
    e.target.value = "";
  };

  const handleFormSubmit = data => {
    const formData = new FormData();
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

    (data.assistants ?? []).forEach(id =>
      formData.append("assistant_ids[]", id),
    );

    (data.classTimes ?? []).forEach((item, i) => {
      formData.append(`class_times[${i}][date]`, item.date);
      formData.append(`class_times[${i}][from]`, item.timeFrom);
      formData.append(`class_times[${i}][to]`, item.timeTo);
    });

    documents.forEach(file => formData.append("documents[]", file));

    if (isPastClass && signatureFile)
      formData.append("signature", signatureFile);

    onSubmit(formData);
  };

  // ── Read-only date input style ─────────────────────────────────────────────
  const readOnlyCls =
    "w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md px-3 py-3 text-sm cursor-not-allowed select-none";

  return (
    <FormContainer form={form} onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Registration status / link */}
        {isEdit &&
          (() => {
            const days = Number(defaultValues?.closeRegistrationDays ?? 0);
            const hours = Number(defaultValues?.closeRegistrationHours ?? 0);
            const firstDate = defaultValues?.classTimes?.[0]?.date;
            if (!firstDate) return null;

            const classStart = new Date(
              `${firstDate}T${to24Hour(defaultValues?.classTimes?.[0]?.from ?? defaultValues?.classTimes?.[0]?.timeFrom ?? "")}`,
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
                    href={
                      typeof window !== "undefined"
                        ? `${window.origin}/enroll/${id}`
                        : "#"
                    }
                    className="underline text-brown"
                    target="_blank"
                  >
                    {typeof window !== "undefined" &&
                      `${window.origin}/enroll/${id}`}
                  </Link>
                </p>
              </div>
            );
          })()}

        {/* Certifying Body filter */}
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

        {/* Assistants */}
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

        {/* Price + Max Students + Ratio */}
        <FormInput
          name="price"
          type="number"
          label="Price"
          placeholder="e.g. 100"
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

        {/* Total Hours — auto-computed, read-only */}
        <div className="flex flex-col gap-2.5">
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray">
            Total Hours
            <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
              (auto-calculated)
            </span>
          </label>
          <input
            readOnly
            tabIndex={-1}
            value={watch("totalHours") || "—"}
            className={readOnlyCls}
          />
        </div>

        {/* Close Registration */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray">
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
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray">
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

        {/* Certificate dates — auto-computed, read-only */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray">
            Certificate Issued On
            <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
              (last class date)
            </span>
          </label>
          <input
            readOnly
            tabIndex={-1}
            value={watch("certificateIssued") || "—"}
            className={readOnlyCls}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Certificate Expires On
            <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
              (issued + 2 years)
            </span>
          </label>
          <input
            readOnly
            tabIndex={-1}
            value={watch("certificateExpire") || "—"}
            className={readOnlyCls}
          />
        </div>

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

        {/* Documents */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Documents
          </label>

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
                  <button
                    type="button"
                    onClick={() =>
                      setDocuments(prev => prev.filter((_, j) => j !== i))
                    }
                  >
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
