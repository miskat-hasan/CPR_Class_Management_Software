// src/components/enroll/StepCourseOptions.jsx
"use client";

import { useForm } from "react-hook-form";

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = val => parseFloat(val ?? 0).toFixed(2);

const SectionCard = ({ title, children }) => (
  <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm mb-5">
    {title && (
      <div className="bg-gray-50 dark:bg-zinc-900 px-5 py-2.5 border-b border-gray-200 dark:border-zinc-700">
        <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
          {title}
        </h3>
      </div>
    )}
    {children}
  </div>
);

const InfoRow = ({ label, children }) => (
  <div className="grid grid-cols-3 border-b last:border-b-0 border-gray-200 dark:border-zinc-700">
    <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 font-semibold text-sm text-gray-700 dark:text-zinc-300 border-r border-gray-200 dark:border-zinc-700">
      {label}
    </div>
    <div className="col-span-2 px-4 py-3 text-sm text-gray-800 dark:text-zinc-200">
      {children}
    </div>
  </div>
);

const RadioRow = ({
  label,
  name,
  register,
  value1,
  value2,
  label1 = "No",
  label2,
  price,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 items-center border-b last:border-b-0 border-gray-200 dark:border-zinc-700">
    <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-4 font-semibold text-sm uppercase text-gray-700 dark:text-zinc-300 sm:border-r border-gray-200 dark:border-zinc-700 h-full flex items-center">
      {label}
    </div>
    <div className="col-span-2 px-6 py-4 flex items-center gap-6 bg-white dark:bg-black">
      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
        <input
          type="radio"
          value={value1}
          {...register}
          className="accent-gray-900 dark:accent-white"
        />
        {label1}
      </label>
      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
        <input
          type="radio"
          value={value2}
          {...register}
          className="accent-gray-900 dark:accent-white"
        />
        {label2 ?? `Yes${price !== undefined ? ` (add $${fmt(price)})` : ""}`}
      </label>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const StepCourseOptions = ({ form, classDetails, addonsList, onNext }) => {
  const { register } = form;

  const course = classDetails?.course;
  const location = classDetails?.location;
  const trainingAddress = [
    location?.address_1,
    location?.address_2,
    location?.city,
    location?.state,
    location?.zip,
    location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      {/* Class summary */}
      <div className="flex flex-col md:flex-row gap-4 mb-5">
        {course?.course_image_url && (
          <div className="shrink-0">
            <img
              src={course?.course_image_url}
              alt={course.course_name}
              className="rounded-md w-full md:max-w-[160px] object-cover"
            />
          </div>
        )}
        <SectionCard title={null}>
          <div className="bg-gray-100 dark:bg-zinc-900 px-5 py-3 border-b border-gray-200 dark:border-zinc-700">
            <h2 className="font-semibold text-base uppercase text-gray-800 dark:text-white">
              {course?.course_name}
            </h2>
          </div>
          <InfoRow label="Date/Time:">
            <div className="flex flex-col gap-0.5">
              {classDetails?.class_times?.map((t, i) => (
                <span key={i}>
                  {t.date} from {t.from} to {t.to}
                </span>
              ))}
            </div>
          </InfoRow>
          <InfoRow label="Location:">{trainingAddress || "—"}</InfoRow>
          <InfoRow label="Class Price:">
            <span className="font-medium">${fmt(classDetails?.price)}</span>
          </InfoRow>
        </SectionCard>
      </div>

      {/* Course description */}
      {course?.description && (
        <div
          className="prose dark:prose-invert max-w-none text-sm leading-relaxed mb-5
            [&_ol]:list-decimal [&_ol]:pl-5
            [&_li[data-list=bullet]]:list-disc [&_li[data-list=bullet]]:ml-6"
          dangerouslySetInnerHTML={{
            __html: course.description
              ?.replace(/background-color:\s*rgb\(255,\s*255,\s*255\);?/g, "")
              ?.replace(/color:\s*rgb\(28,\s*27,\s*31\);?/g, ""),
          }}
        />
      )}

      {/* Add-ons */}
      {addonsList.length > 0 && (
        <>
          {course?.prompt && (
            <p className="text-sm text-gray-700 dark:text-zinc-300 mb-2">
              {course.prompt}
            </p>
          )}
          <SectionCard title="Course Add-ons">
            {addonsList.map(addon => (
              <RadioRow
                key={addon.id}
                label={addon.name}
                name={`addons.${addon.id}`}
                register={register(`addons.${addon.id}`, {
                  value: addon.default_selection === 1 ? "yes" : "no",
                })}
                value1="no"
                value2="yes"
                price={addon.price}
              />
            ))}
          </SectionCard>
        </>
      )}

      {/* Reschedule insurance */}
      {course?.options?.allow_students_reschedule && (
        <>
          <h5 className="font-semibold text-gray-800 dark:text-white mb-1">
            Reschedule Insurance
          </h5>
          <hr className="dark:border-zinc-700 mb-3" />
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">
            This course offers reschedule insurance at a cost of $
            {fmt(course?.reschedule_insurance_price)}. Purchasing this will
            allow you to reschedule yourself in the future at no additional
            cost.
          </p>
          <SectionCard title={null}>
            <RadioRow
              label="Would you like to purchase reschedule insurance?"
              name="reschedule_insurance"
              register={register("reschedule_insurance")}
              value1="no"
              value2="yes"
              price={course?.reschedule_insurance_price}
            />
          </SectionCard>
        </>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm rounded-md hover:bg-gray-700 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Continue with Registration →
        </button>
      </div>
    </div>
  );
};

export default StepCourseOptions;
