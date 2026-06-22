// src/components/dashboard/courses/course-type/CourseForm.jsx
"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import CustomSelect from "@/components/shared/form/CustomSelect";
import MultiSelect from "@/components/shared/form/MultiSelect";
import BackButton from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import {
  getAllDiscipline,
  getAllProductAddOns,
  getAllKeyCodeBank,
  getAllCardType,
  getSecondCardType,
  getAllCourseImages,
  getAllCertifyingBody,
  getAllExternalSKU,
} from "@/hooks/api/dashboardApi";
import { LucideTrash2 } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

// Options with parent-child relationships
const OPTION_GROUPS = [
  {
    key: "prompt_for_certification",
    label: "Prompt for certification / recertification during registration",
    children: [],
  },
  {
    key: "include_student_instructor_ratio",
    label: "Include student to instructor ratio on roster",
    children: [],
  },
  {
    key: "include_student_manikin_ratio",
    label: "Include student to manikin ratio on roster",
    children: [],
  },
  {
    key: "include_electronic_signature_aha",
    label: "Include electronic signature for AHA roster",
    children: [],
  },
  {
    key: "use_certificate_number_instead_score",
    label: "Use certificate number instead of test score (online course)",
    children: [],
  },
  {
    key: "show_seats_remaining",
    label: "Show the number of seats remaining on the schedule page",
    children: [],
  },
  {
    key: "allow_will_call_to_schedule",
    label: 'Allow students to select "will call to schedule"',
    children: [],
  },
  {
    key: "prompt_for_license_number",
    label: "Prompt for license number during registration",
    children: [
      {
        key: "require_license_number",
        label: "Require license number during registration",
      },
    ],
  },
  {
    key: "allow_alternate_date_time",
    label: "Allow an alternate date/time description",
    children: [],
  },
  {
    key: "enable_class_roster_expirations",
    label: "Enable Class Roster Expirations",
    children: [],
  },
  {
    key: "enable_registration_waitlist",
    label: "Enable Registration Waitlist",
    children: [{ key: "automatic_waitlist", label: "Automatic Waitlist" }],
  },
  {
    key: "allow_students_reschedule",
    label: "Allow students taking this course to reschedule themselves",
    children: [],
  },
];

const DEFAULT_OPTIONS = Object.fromEntries(
  OPTION_GROUPS.flatMap(g => [
    [g.key, false],
    ...g.children.map(c => [c.key, false]),
  ]),
);

export default function CourseForm({
  defaultValues,
  onSubmit,
  isPending,
  isEdit = false,
}) {
  const descriptionRef = useRef(null);
  const emailBodyRef = useRef(null);

  const form = useForm({
    defaultValues: defaultValues ?? {
      course_name: "",
      mode: "on-site",
      discipline: "",
      deposit_registration: false,
      multiple_pricing: false,
      deposit_amounts: "",
      price: "",
      price_level_prompt: "",
      addonPrompt: "",
      add_ons: [],
      shipping_price: "",
      keycode_bank: "",
      course_certifying_body_id: "",
      sku_ids: [],
      cardType: "",
      secondCardType: "",
      course_image: "",
      options: DEFAULT_OPTIONS,
      reschedule_price: "",
      reschedule_insurance_price: "",
      prevent_reschedule_days_before: "",
      will_call_prompt: "",
      ceu_credits: "",
      courseConfirmationEmailCCS: "",
      courseConfirmationEmailSubject: "",
      payloadConfirmationEmailSubject: "",
      use_email_for_payments: false,
      priceLevel: [
        { price: "", code: "", description: "" },
        { price: "", code: "", description: "" },
      ],
    },
  });

  const { register, watch, control, setValue, reset } = form;
  const watchFields = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceLevel",
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      setTimeout(() => {
        if (descriptionRef.current && defaultValues.description) {
          descriptionRef.current?.setContents?.(defaultValues.description);
        }
        if (emailBodyRef.current && defaultValues.email_body) {
          emailBodyRef.current?.setContents?.(defaultValues.email_body);
        }
      }, 100);
    }
  }, [defaultValues, reset]);

  // Data fetching
  const { data: disciplineData, isLoading: disciplineLoading } =
    getAllDiscipline();
  const { data: addOnsData, isLoading: addOnsLoading } = getAllProductAddOns();
  const { data: keyCodeBankData, isLoading: keyCodeBankLoading } =
    getAllKeyCodeBank();
  const { data: cardTypeData, isLoading: cardTypeLoading } = getAllCardType();
  const { data: secondCardData, isLoading: secondCardLoading } =
    getSecondCardType();
  const { data: courseImageData, isLoading: courseImageLoading } =
    getAllCourseImages(1, 100);
  const { data: certifyingBodies, isLoading: certifyingLoading } =
    getAllCertifyingBody();
  const { data: externalSkuData, isLoading: externalSkuLoading } =
    getAllExternalSKU(1, 100);

  // Format options for selects
  const courseImageOptions = (courseImageData?.data?.data ?? []).map(img => ({
    id: img.id,
    name: img.title,
    image: img.image,
  }));

  const certifyingOptions = (certifyingBodies?.data?.data ?? []).map(cb => ({
    id: cb.id,
    name: cb.name,
  }));

  certifyingOptions.push({ id: null, name: "None" });

  const skuOptions = (externalSkuData?.data?.data ?? []).map(sku => ({
    id: sku.id,
    name: `${sku.name} (${sku.code})`,
  }));

  // Add-ons helpers — same pattern as SKU multiselect
  const addOnOptions = (addOnsData?.data?.data ?? []).map(a => ({
    id: a.id,
    name: a.name,
  }));

  // Selected image preview
  const selectedImage = courseImageOptions.find(
    img => String(img.id) === String(watchFields.course_image),
  );

  const certBody = watchFields.course_certifying_body_id;

  const isARC = certBody === "1";
  const isAHA = certBody === "2";
  const allowReschedule = watchFields.options?.allow_students_reschedule;
  const allowWillCall = watchFields.options?.allow_will_call_to_schedule;

  const handleFormSubmit = data => {
    const description = descriptionRef.current?.getContent?.() ?? "";
    const emailBody = emailBodyRef.current?.getContent?.() ?? "";

    const payload = {
      course_name: data.course_name,
      mode: data.mode === "on-site" ? "onsite" : data.mode,
      discipline: Number(data.discipline),
      allow_deposit: data.deposit_registration,
      allow_multiple: data.multiple_pricing,
      shipping_price: Number(data.shipping_price) || 0,
      prompt: data.addonPrompt,
      selected_addons: (data.add_ons ?? []).map(Number),
      ecu_credits: data.ceu_credits,
      description,
      email_body: emailBody,
      confirmation_email: (data.courseConfirmationEmailCCS ?? "")
        .split(",")
        .map(e => e.trim())
        .filter(Boolean),
      course_confirmation_email_subject: data.courseConfirmationEmailSubject,
      payment_confirmation_email_subject: data.payloadConfirmationEmailSubject,
      use_general_email_body: data.use_email_for_payments ? 1 : 0,
      options: data.options,
      price_level_prompt: data.price_level_prompt,
      will_call_prompt: data.will_call_prompt,
      reschedule_price: Number(data.reschedule_price) || 0,
      reschedule_insurance_price: Number(data.reschedule_insurance_price) || 0,
      prevent_reschedule_days_before:
        Number(data.prevent_reschedule_days_before) || 0,
      course_certifying_body_id: Number(data.course_certifying_body_id) || null,
    };

    if (data.keycode_bank) payload.keycode_bank_id = Number(data.keycode_bank);
    if (data.course_image) payload.course_image_id = Number(data.course_image);
    if (data.sku_ids?.length) payload.sku_ids = data.sku_ids.map(Number);
    if (data.cardType) payload.card_type_id = Number(data.cardType);
    if (data.secondCardType)
      payload.second_card_type_id = Number(data.secondCardType);

    if (data.deposit_registration) {
      payload.deposit_amount = Number(data.deposit_amounts);
    }

    if (data.multiple_pricing) {
      payload.multiple_price = data.priceLevel.map(level => ({
        price: Number(level.price),
        code: level.code,
        description: level.description,
      }));
    } else {
      payload.price = Number(data.price);
    }

    onSubmit(payload);
  };

  return (
    <FormContainer form={form} onSubmit={handleFormSubmit}>
      <div className="flex flex-col gap-5 lg:gap-6">
        {/* Course Name */}
        <FormInput
          name="course_name"
          label="Course Name"
          placeholder="Course name"
          rules={{ required: "Course name is required" }}
        />

        {/* Mode */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-700 dark:text-gray">
            Mode
          </p>
          {[
            {
              value: "on-site",
              label: "On-site",
              desc: "Taught in person at a physical location.",
            },
            {
              value: "blended",
              label: "Blended",
              desc: "Has both online and in-person components.",
            },
            {
              value: "online",
              label: "Online",
              desc: "All instruction is asynchronous and virtual.",
            },
          ].map(({ value, label, desc }) => (
            <label
              key={value}
              className="flex w-fit items-center gap-2 text-sm cursor-pointer dark:text-gray"
            >
              <input
                type="radio"
                value={value}
                {...register("mode")}
                className="accent-brown"
              />
              <span>
                <strong>{label}:</strong> {desc}
              </span>
            </label>
          ))}
        </div>
        {isEdit && (
          <div className="flex max-md:flex-col gap-2 font-semibold text-sm text-gray-700 dark:text-gray">
              Direct Schedule Link:
              <Link
                target="_blank"
                href={`/schedule/${defaultValues?.course_id}`}
                className="text-brown"
              >
                {window.location.origin}/schedule/{defaultValues?.course_id}
              </Link>
            
          </div>
        )}

        {/* Discipline */}
        <Controller
          name="discipline"
          control={control}
          rules={{ required: "Discipline is required" }}
          render={({ field, fieldState }) => (
            <CustomSelect
              {...field}
              label="Discipline"
              placeholder="Select discipline"
              isLoading={disciplineLoading}
              options={disciplineData?.data?.data ?? []}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Price Options */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-700 dark:text-gray">
            Price Options
          </p>
          <label className="flex items-center gap-2 w-fit text-sm cursor-pointer dark:text-gray">
            <input
              {...register("deposit_registration")}
              type="checkbox"
              className="accent-brown"
            />
            Allow registrations with a deposit
          </label>
          <label className="flex items-center gap-2 w-fit text-sm cursor-pointer dark:text-gray">
            <input
              {...register("multiple_pricing")}
              type="checkbox"
              className="accent-brown"
            />
            Allow multiple pricing levels
          </label>
        </div>

        {watchFields.deposit_registration && (
          <FormInput
            name="deposit_amounts"
            label="Deposit Amount"
            placeholder="$0.00"
          />
        )}

        {watchFields.multiple_pricing ? (
          <div className="flex flex-col gap-3">
            <FormTextarea
              name="price_level_prompt"
              label="Price Level Prompt"
              rows={2}
            />
            <div className="bg-neutral-50 dark:bg-dark border dark:border-gray-700 px-3 pt-3 pb-4 rounded-md">
              <h6 className="text-base font-semibold mb-2 dark:text-gray">
                Price Levels
              </h6>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mt-3">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <FormInput
                      name={`priceLevel.${index}.price`}
                      placeholder="Price"
                    />
                    <FormInput
                      name={`priceLevel.${index}.code`}
                      placeholder="Code"
                    />
                    <FormInput
                      name={`priceLevel.${index}.description`}
                      placeholder="Description"
                    />
                  </div>
                  {fields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 bg-neutral-200 dark:bg-gray-700 rounded-md hover:bg-red-100 transition cursor-pointer"
                    >
                      <LucideTrash2 className="size-4 text-gray-600 dark:text-gray" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ price: "", code: "", description: "" })}
                className="mt-3 px-3 py-1.5 inline-flex items-center gap-1.5 border rounded-md text-sm bg-neutral-700 dark:bg-gray-800 text-neutral-100 cursor-pointer hover:bg-neutral-600 w-fit"
              >
                <FaPlus className="size-3" /> Add more
              </button>
            </div>
          </div>
        ) : (
          <FormInput name="price" label="Price" placeholder="0.00" />
        )}

        {/* Add-ons — MultiSelect same as SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormTextarea
            name="addonPrompt"
            label="Add-on Prompt"
            placeholder="Prompt for add-ons"
          />
          <Controller
            name="add_ons"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                label="Add-ons"
                placeholder="Search and select add-ons..."
                isLoading={addOnsLoading}
                options={addOnOptions}
              />
            )}
          />
        </div>

        {/* Shipping + Keycode Bank */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="shipping_price"
            label="Shipping Price"
            placeholder="0.00"
          />
          <Controller
            name="keycode_bank"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Keycode Bank"
                placeholder="Select keycode bank"
                isLoading={keyCodeBankLoading}
                options={keyCodeBankData?.data?.data ?? []}
              />
            )}
          />
        </div>

        {/* Certifying Body */}
        <Controller
          name="course_certifying_body_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Course Certifying Body"
              placeholder="Select certifying body"
              isLoading={certifyingLoading}
              options={certifyingOptions}
            />
          )}
        />

        {/* ARC — Course SKUs multi select */}
        {isARC && (
          <Controller
            name="sku_ids"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                label="Course SKUs"
                placeholder="Search and select SKUs..."
                isLoading={externalSkuLoading}
                options={skuOptions}
              />
            )}
          />
        )}

        {/* AHA — Card Types */}
        {isAHA && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="cardType"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="Card Type"
                  placeholder="Select card type"
                  isLoading={cardTypeLoading}
                  options={cardTypeData?.data?.data ?? []}
                />
              )}
            />
            <Controller
              name="secondCardType"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="Second Card Type"
                  placeholder="Select second card type"
                  isLoading={secondCardLoading}
                  options={secondCardData?.data?.data ?? []}
                />
              )}
            />
          </div>
        )}

        {/* Course Image — select + preview */}
        <div className="flex flex-col gap-3">
          <Controller
            name="course_image"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Course Image"
                placeholder="Select course image"
                isLoading={courseImageLoading}
                options={courseImageOptions}
              />
            )}
          />
          {/* Preview */}
          {selectedImage?.image && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray">
                Preview
              </label>
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${selectedImage.image}`}
                width={120}
                height={120}
                alt={selectedImage.name}
                className="object-cover rounded border dark:border-gray-700"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-700 dark:text-gray">
            Options
          </p>
          <div className="flex flex-col gap-2">
            {OPTION_GROUPS.map(({ key, label, children }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray w-fit">
                  <input
                    type="checkbox"
                    {...register(`options.${key}`)}
                    className="accent-brown"
                  />
                  {label}
                </label>

                {/* Children — indented, disabled if parent unchecked */}
                {children.map(child => {
                  const parentChecked = watchFields.options?.[key];
                  return (
                    <label
                      key={child.key}
                      className={`ml-6 flex items-center gap-2 text-sm w-fit ${
                        parentChecked
                          ? "cursor-pointer dark:text-gray"
                          : "cursor-not-allowed opacity-40 dark:text-gray"
                      }`}
                    >
                      <input
                        type="checkbox"
                        {...register(`options.${child.key}`)}
                        disabled={!parentChecked}
                        className="accent-brown"
                      />
                      {child.label}
                    </label>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Reschedule fields — shown when allow_students_reschedule checked */}
          {allowReschedule && (
            <div className="flex flex-wrap items-center gap-3 ml-0 mt-2 p-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray whitespace-nowrap">
                  Reschedule Price:
                </label>
                <input
                  type="number"
                  {...register("reschedule_price")}
                  placeholder="0.00"
                  className="w-28 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray whitespace-nowrap">
                  Reschedule Insurance Price:
                </label>
                <input
                  type="number"
                  {...register("reschedule_insurance_price")}
                  placeholder="0.00"
                  className="w-28 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray whitespace-nowrap">
                  Prevent Reschedule:
                </label>
                <input
                  type="number"
                  {...register("prevent_reschedule_days_before")}
                  placeholder="0"
                  className="w-20 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  days before class start date
                </span>
              </div>
            </div>
          )}

          {/* Will call prompt — shown when allow_will_call_to_schedule checked */}
          {allowWillCall && (
            <div className="mt-2">
              <FormInput
                name="will_call_prompt"
                label='"Will Call" Prompt'
                placeholder="I will call to schedule my classroom session"
              />
            </div>
          )}
        </div>

        {/* CEU Credits */}
        <FormInput
          name="ceu_credits"
          label="CEU Credits"
          placeholder="e.g. 3"
        />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Description
          </label>
          <RichTextEditor ref={descriptionRef} />
        </div>

        {/* Email fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray">
              Course Confirmation Email CCs
              <span className="ml-1 text-xs font-normal text-gray-400">
                (comma separated)
              </span>
            </label>
            <textarea
              {...register("courseConfirmationEmailCCS")}
              placeholder="admin@example.com, manager@example.com"
              className="border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            ></textarea>
          </div>
          <FormInput
            name="courseConfirmationEmailSubject"
            label="Confirmation Email Subject"
            placeholder="Your Course Registration Confirmation"
          />
        </div>

        <FormInput
          name="payloadConfirmationEmailSubject"
          label="Payment Confirmation Email Subject"
          placeholder="Payment Received - Course Enrollment"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Course Confirmation Email Body
          </label>
          <RichTextEditor ref={emailBodyRef} />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray w-fit">
          <input
            {...register("use_email_for_payments")}
            type="checkbox"
            className="accent-brown"
          />
          Use the same email body for payments / general registrations
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-3">
          <BackButton />
          <Button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : isEdit ? "Save Course" : "Create Course"}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
}
