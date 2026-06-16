"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import MultiSelect from "@/components/shared/form/MultiSelect";
import {
  getAllCourses,
  sendTestTextMessage,
} from "@/hooks/api/dashboardApi";
import { toast } from "sonner";

const SUPPORTED_TOKENS = [
  { token: "[FIRSTNAME]", desc: "The student's first name." },
  { token: "[CLASSNAME]", desc: "The name of the course." },
  { token: "[CLASSINFO]", desc: "Class location and date/times." },
  {
    token: "[DISCIPLINE]",
    desc: "The discipline name associated with the course.",
  },
  {
    token: "[CONFIRMATIONLINK]",
    desc: "A link to their confirmation page with all of the class details.",
  },
];

export default function TextMessageForm({
  defaultValues,
  messageId,
  onSubmit,
  isPending,
  isEdit = false,
}) {
  const [testPhone, setTestPhone] = useState("");

  const form = useForm({
    defaultValues: defaultValues ?? {
      active: false,
      days: "",
      daysType: "before",
      messageName: "",
      message: "",
      dontSendOnRenewal: false,
      sendToAllCourse: true,
      courseIds: [],
      testMessage: "",
    },
  });

  const { register, control, watch, reset } = form;
  const sendToAll = watch("sendToAllCourse");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      setTestPhone(defaultValues.testMessage ?? "");
    }
  }, [defaultValues, reset]);

  const { data: courseTypesData, isLoading: courseTypesLoading } =
    getAllCourses();
  const { mutate: sendTest, isPending: isSendingTest } = sendTestTextMessage();

  const handleSendTest = () => {
    if (!testPhone.trim()) {
      toast.error("Enter a phone number");
      return;
    }
    if (!messageId) {
      toast.error("Save the message first before sending a test");
      return;
    }
    sendTest(
      { data: { message_id: String(messageId), test_message: testPhone } },
      {
        onSuccess: res => toast.success(res?.message || "Test message sent"),
        onError: err =>
          toast.error(err?.response?.data?.message || "Failed to send"),
      },
    );
  };

  const handleSubmit = data => {
    const payload = {
      active: data.active,
      days: Number(data.days),
      days_type: data.daysType,
      message_name: data.messageName,
      message: data.message,
      dont_send_renewal_class: data.dontSendOnRenewal,
      send_to_all_course: data.sendToAllCourse,
      test_message: testPhone || undefined,
      ...(!data.sendToAllCourse && {
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
        {/* Active */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Active
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray">
              <input
                type="radio"
                value="true"
                onChange={() => form.setValue("active", true)}
                checked={watch("active") === true}
                className="accent-brown"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray">
              <input
                type="radio"
                value="false"
                onChange={() => form.setValue("active", false)}
                checked={watch("active") === false}
                className="accent-brown"
              />
              No
            </label>
          </div>
        </div>

        {/* Timing */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Timing
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm dark:text-gray">Send text message</span>
            <input
              type="number"
              min="0"
              {...register("days", { required: "Days is required" })}
              placeholder="0"
              className="w-20 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <span className="text-sm dark:text-gray">day(s)</span>
            <select
              {...register("daysType")}
              className="border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="before">before</option>
              <option value="after">after</option>
            </select>
            <span className="text-sm dark:text-gray">the class</span>
          </div>
        </div>

        {/* Message Name */}
        <FormInput
          name="messageName"
          label="Message Name"
          placeholder="e.g. 3 Day Reminder"
          rules={{ required: "Message name is required" }}
        />

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Message
          </label>
          <textarea
            {...register("message", { required: "Message is required" })}
            rows={5}
            placeholder="Type your message here..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
          />
        </div>

        {/* Supported Tokens */}
        <div className="flex flex-col gap-2 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray mb-1">
            Supported Tokens
          </p>
          {SUPPORTED_TOKENS.map(t => (
            <p
              key={t.token}
              className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              <span
                className="font-medium text-brown cursor-pointer hover:underline"
                onClick={() => {
                  navigator.clipboard?.writeText(t.token);
                  toast.success(`Copied ${t.token}`);
                }}
              >
                {t.token}
              </span>
              {" — "}
              {t.desc}
            </p>
          ))}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray">
            Options
          </p>
          <label className="flex items-center gap-2 text-sm cursor-pointer w-fit dark:text-gray">
            <input
              type="checkbox"
              {...register("dontSendOnRenewal")}
              className="accent-brown"
            />
            Don&apos;t send scheduled text if the customer registers for a
            renewal class
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
                onChange={() => form.setValue("sendToAllCourse", true)}
                checked={sendToAll === true}
                className="accent-brown"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray">
              <input
                type="radio"
                onChange={() => form.setValue("sendToAllCourse", false)}
                checked={sendToAll === false}
                className="accent-brown"
              />
              No
            </label>
          </div>
        </div>

        {/* Course multiselect */}
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

        {/* Test */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Test
            {!isEdit && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                (save first, then send)
              </span>
            )}
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm dark:text-gray">
              Send test text message to
            </span>
            <input
              value={testPhone}
              onChange={e => setTestPhone(e.target.value)}
              placeholder="+1234567890"
              className="border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-48"
            />
            <Button
              type="button"
              onClick={handleSendTest}
              disabled={isSendingTest || !isEdit}
              title={!isEdit ? "Save the message first to send a test" : ""}
              className="px-4 py-2 text-sm rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingTest ? "Sending..." : "Go"}
            </Button>
          </div>
        </div>
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
              ? "Update Text Message"
              : "Add Text Message"}
        </Button>
      </div>
    </FormContainer>
  );
}
