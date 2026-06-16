"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import MultiSelect from "@/components/shared/form/MultiSelect";
import { getAllCourses } from "@/hooks/api/dashboardApi";

export default function CampaignForm({
  defaultValues,
  onSubmit,
  isPending,
  isEdit = false,
}) {
  const form = useForm({
    defaultValues: defaultValues ?? {
      name: "",
      mailFromAddress: "",
      mailFromDisplayName: "",
      bccMailTo: "",
      active: false,
      stopOnRenewal: false,
      sendToAllCourse: true,
      courseIds: [],
    },
  });

  const { control, register, watch, reset } = form;
  const sendToAll = watch("sendToAllCourse");

  // Update form when defaultValues change (edit mode)
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const { data: courseTypesData, isLoading: courseTypesLoading } =
    getAllCourses();

  const handleSubmit = data => {
    const payload = {
      name: data.name,
      mail_from_address: data.mailFromAddress,
      mail_from_display_name: data.mailFromDisplayName,
      bcc_mail_to: data.bccMailTo
        ? data.bccMailTo
            .split(",")
            .map(e => e.trim())
            .filter(Boolean)
        : [],
      option: data.stopOnRenewal
        ? "stop_on_renewal"
        : data.active
          ? "active"
          : "",
      send_to_all_course: JSON.parse(data.sendToAllCourse),
      ...(!JSON.parse(data.sendToAllCourse) && {
        course_ids: Array.isArray(data.courseIds)
          ? data.courseIds.map(Number)
          : [],
      }),
    };
    onSubmit(payload);
  };

  return (
    <FormContainer form={form} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5">
        <FormInput
          name="name"
          label="Name"
          placeholder="Campaign name"
          rules={{ required: "Name is required" }}
        />
        <FormInput
          name="mailFromAddress"
          label="Mail From Address"
          placeholder="mail@example.com"
          rules={{
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          }}
        />
        <FormInput
          name="mailFromDisplayName"
          label="Mail From Display Name"
          placeholder="Training Center"
        />
        <FormInput
          name="bccMailTo"
          label="BCC Emails To"
          placeholder="admin@example.com, manager@example.com"
        />

        {/* Options */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray">
            Options
          </p>
          <label className="flex items-center gap-2 text-sm cursor-pointer w-fit dark:text-gray">
            <input
              type="checkbox"
              {...register("active")}
              className="accent-brown"
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer w-fit dark:text-gray">
            <input
              type="checkbox"
              {...register("stopOnRenewal")}
              className="accent-brown"
            />
            Stop this campaign if the customer registers for a renewal class
          </label>
        </div>

        {/* Send to all course types */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray">
            Send to all Course Types
          </p>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray">
              <input
                type="radio"
                value="true"
                {...register("sendToAllCourse")}
                onChange={() => form.setValue("sendToAllCourse", true)}
                checked={sendToAll === true}
                className="accent-brown"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray">
              <input
                type="radio"
                value="false"
                {...register("sendToAllCourse")}
                onChange={() => form.setValue("sendToAllCourse", false)}
                checked={sendToAll === false}
                className="accent-brown"
              />
              No
            </label>
          </div>
        </div>

        {/* Course multiselect — only when sendToAll is false */}
        {sendToAll === false && (
          <Controller
            name="courseIds"
            control={control}
            rules={{ required: "Select at least one course" }}
            render={({ field, fieldState }) => (
              <MultiSelect
                {...field}
                label="Select Course Types"
                placeholder="Search and select courses..."
                isLoading={courseTypesLoading}
                options={courseTypesData?.data?.data ?? []}
                error={fieldState.error?.message}
              />
            )}
          />
        )}
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <BackButton />
        <Button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Saving..."
            : isEdit
              ? "Update Campaign"
              : "Add Campaign"}
        </Button>
      </div>
    </FormContainer>
  );
}
