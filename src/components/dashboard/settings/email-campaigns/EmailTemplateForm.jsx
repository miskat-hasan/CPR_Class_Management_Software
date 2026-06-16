"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import { sendTestEmail } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

const SUPPORTED_TOKENS = [
  { token: "[FIRSTNAME]", desc: "The student's first name." },
  { token: "[CLASSNAME]", desc: "The name of the course." },
  {
    token: "[CLASSINFO]",
    desc: "Class location, instructor, directions and date/times.",
  },
  {
    token: "[DISCIPLINE]",
    desc: "The discipline name associated with the course.",
  },
  { token: "[CLASSID]", desc: "The ID number of the scheduled class." },
  {
    token: "[CONFIRMATIONURL]",
    desc: "A hyperlink to the registrant's confirmation information.",
  },
  {
    token: "[PAYMENTFORMURL]",
    desc: "A hyperlink to the registrant's payment form - used to pay any balance due.",
  },
];

export default function EmailTemplateForm({
  defaultValues,
  emailId,
  onSubmit,
  isPending,
  isEdit = false,
}) {
  const bodyRef = useRef(null);
  const [testEmail, setTestEmail] = useState("");
  const [editorReady, setEditorReady] = useState(false);

  const form = useForm({
    defaultValues: defaultValues ?? {
      days: "",
      daysType: "before",
      subject: "",
    },
  });
  const { register, reset, getValues } = form;

  console.log(defaultValues?.body);

  // Reset form + populate editor when defaultValues arrive (edit mode)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      if (bodyRef.current) {
        bodyRef.current?.setContents?.(defaultValues.body);
      }
    }
  }, [defaultValues, reset, editorReady]);

  const { mutate: sendTest, isPending: isSendingTest } = sendTestEmail();

  const handleSubmit = data => {
    // Read body from editor ref
    const body = bodyRef.current?.getContent() ?? "";

    onSubmit({
      days: Number(data.days),
      days_type: data.daysType,
      subject: data.subject,
      body,
      test_email: testEmail || undefined,
    });
  };

  const handleSendTest = () => {
    if (!testEmail.trim()) {
      toast.error("Enter a test email address");
      return;
    }
    if (!emailId) {
      toast.error("Save the email first before sending a test");
      return;
    }
    sendTest(
      { data: { email_id: Number(emailId), test_email: testEmail } },
      {
        onSuccess: res => toast.success(res?.message || "Test email sent"),
        onError: err =>
          toast.error(err?.response?.data?.message || "Failed to send"),
      },
    );
  };

  return (
    <FormContainer form={form} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5">
        {/* Timing */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Timing
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm dark:text-gray">Send email</span>
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

        {/* Subject */}
        <FormInput
          name="subject"
          label="Subject Line"
          placeholder="Email subject"
          rules={{ required: "Subject is required" }}
        />

        {/* Email Body */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray">
            Email Body
          </label>
          <RichTextEditor
            ref={bodyRef}
            onReady={() => {
              setEditorReady(true);
              // Set initial content after editor mounts in edit mode
              if (defaultValues?.body && bodyRef.current) {
                bodyRef.current?.setContents?.(defaultValues.body);
              }
            }}
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
                  // Click token to copy to clipboard
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

        {/* Test email — available on both add and edit */}
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
            <span className="text-sm dark:text-gray">Send test email to</span>
            <input
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-56"
            />
            <Button
              type="button"
              onClick={handleSendTest}
              disabled={isSendingTest || !isEdit}
              title={!isEdit ? "Save the email first to send a test" : ""}
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
          {isPending ? "Saving..." : isEdit ? "Update Email" : "Add Email"}
        </Button>
      </div>
    </FormContainer>
  );
}
