// src/components/dashboard/send-communication/SendCommunication.jsx
"use client";

import { useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import SectionTitle from "@/components/common/SectionTitle";
import FormInput from "@/components/shared/form/FormInput";
import FormContainer from "@/components/shared/form/FormContainer";
import { Button } from "@/components/ui/button";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  getSingleClass,
  getSingleLocation,
  useGetStudentByClassId,
  useResendConfirmationEmail,
  useSendCustomEmail,
  useSendTextMessage,
} from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

// ─── Recipient row ────────────────────────────────────────────────────────────
const RecipientRow = ({ id, phone, email, name, checked, onToggle }) => (
  <label
    htmlFor={`recipient-${id}`}
    className="flex items-center gap-3 flex-wrap px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
  >
    <input
      type="checkbox"
      id={`recipient-${id}`}
      checked={checked}
      onChange={() => onToggle(id)}
      className="accent-brown size-4 shrink-0"
    />
    <span className="text-sm text-gray-500 dark:text-gray-400 w-[130px] shrink-0">
      {phone ?? "—"}
    </span>
    <span className="text-sm text-gray-700 dark:text-gray truncate max-w-[220px] flex-1">
      {email ?? "—"}
    </span>
    <span className="text-sm font-medium text-gray-900 dark:text-white">
      {name}
    </span>
  </label>
);

// ─── Recipient group ──────────────────────────────────────────────────────────
const RecipientGroup = ({ title, count, children }) => (
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 px-1">
      {title}
      {typeof count === "number" && (
        <span className="ml-1.5 text-gray-300 dark:text-gray-600">
          ({count})
        </span>
      )}
    </p>
    <div className="border border-gray-100 dark:border-zinc-800 rounded-md divide-y divide-gray-100 dark:divide-zinc-800 overflow-hidden">
      {children}
    </div>
  </div>
);

// ─── Field layout helper ──────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4">
    <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-[130px] sm:pt-2 shrink-0">
      {label}:
    </span>
    <div className="flex-1">{children}</div>
  </div>
);

const fmt = val => parseFloat(val ?? 0).toFixed(2);

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

const formatPersonName = person =>
  [person?.first_name, person?.last_name].filter(Boolean).join(" ") ||
  person?.username ||
  "—";

// ─── Main component ───────────────────────────────────────────────────────────
const SendCommunication = () => {
  const { id } = useParams();

  // recipient selection
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedInstructorIds, setSelectedInstructorIds] = useState([]);
  const [selectedAssistantIds, setSelectedAssistantIds] = useState([]);

  // rich-text ref for email body
  const emailBodyRef = useRef(null);

  // data
  const { data: studentData, isLoading } = useGetStudentByClassId(id);
  const students = studentData?.data?.students ?? [];

  const { data: classData, isLoading: classDataLoading } = getSingleClass(id);

  const course = classData?.data?.course;

  const { data: locationData } = getSingleLocation(
    classData?.data?.location_id,
  );

  const trainingAddress = [
    locationData?.data?.address_1,
    locationData?.data?.address_2,
    locationData?.data?.city,
    locationData?.data?.state,
    locationData?.data?.zip,
    locationData?.data?.country,
  ]
    .filter(Boolean)
    .join(", ");

  // Instructor is a single object on the class. Assistants are an array,
  // structured like students (a list of people, each selectable individually).
  const instructor = classData?.data?.instructor ?? null;
  const assistants = useMemo(
    () => classData?.data?.assistants ?? [],
    [classData],
  );

  // mutations
  const { mutate: resendConfirmation, isPending: resendPending } =
    useResendConfirmationEmail();
  const { mutate: sendCustomEmail, isPending: emailPending } =
    useSendCustomEmail();
  const { mutate: sendTextMessage, isPending: textPending } =
    useSendTextMessage();

  // email form
  const emailForm = useForm({
    defaultValues: { from: "", bcc: "", subject: "" },
  });

  // text form
  const textForm = useForm({
    defaultValues: { message: "" },
  });

  // ── selection helpers ──
  const toggleStudent = studentId =>
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(i => i !== studentId)
        : [...prev, studentId],
    );

  const toggleInstructor = instructorId =>
    setSelectedInstructorIds(prev =>
      prev.includes(instructorId)
        ? prev.filter(i => i !== instructorId)
        : [...prev, instructorId],
    );

  const toggleAssistant = assistantId =>
    setSelectedAssistantIds(prev =>
      prev.includes(assistantId)
        ? prev.filter(i => i !== assistantId)
        : [...prev, assistantId],
    );

  const selectAll = () => {
    setSelectedStudentIds(students.map(s => s.id));
    setSelectedInstructorIds(instructor ? [instructor.id] : []);
    setSelectedAssistantIds(assistants.map(a => a.id));
  };

  const selectNone = () => {
    setSelectedStudentIds([]);
    setSelectedInstructorIds([]);
    setSelectedAssistantIds([]);
  };

  const totalRecipients =
    selectedStudentIds.length +
    selectedInstructorIds.length +
    selectedAssistantIds.length;

  const hasRecipients = totalRecipients > 0;

  // ── handlers ──
  const handleResendConfirmation = () => {
    if (!hasRecipients) {
      toast.error("Please select at least one recipient.");
      return;
    }
    resendConfirmation(
      {
        class_id: id,
        instructor_ids: selectedInstructorIds,
        assistant_ids: selectedAssistantIds,
        student_ids: selectedStudentIds,
      },
      {
        onSuccess: res =>
          toast.success(res?.message ?? "Confirmation emails resent."),
        onError: err =>
          toast.error(
            err?.response?.data?.message ??
              "Failed to resend confirmation emails.",
          ),
      },
    );
  };

  const handleSendEmail = data => {
    if (!hasRecipients) {
      toast.error("Please select at least one recipient.");
      return;
    }
    const body = emailBodyRef?.getContent?.() ?? "";
    if (!data.subject.trim() || !body.trim()) {
      toast.error("Subject and body are required.");
      return;
    }
    sendCustomEmail(
      {
        class_id: id,
        from: data.from,
        bcc: data.bcc
          .split(",")
          .map(e => e.trim())
          .filter(Boolean),
        subject: data.subject,
        body,
        instructor_ids: selectedInstructorIds,
        assistant_ids: selectedAssistantIds,
        student_ids: selectedStudentIds,
      },
      {
        onSuccess: res => {
          toast.success(res?.message ?? "Email sent successfully.");
          emailForm.reset();
          emailBodyRef?.setContents?.("");
        },
        onError: err =>
          toast.error(err?.response?.data?.message ?? "Failed to send email."),
      },
    );
  };

  const handleSendText = data => {
    if (!hasRecipients) {
      toast.error("Please select at least one recipient.");
      return;
    }
    sendTextMessage(
      {
        class_id: id,
        message: data.message,
        instructor_ids: selectedInstructorIds,
        assistant_ids: selectedAssistantIds,
        student_ids: selectedStudentIds,
      },
      {
        onSuccess: res => {
          toast.success(res?.message ?? "Text message sent.");
          textForm.reset();
        },
        onError: err =>
          toast.error(
            err?.response?.data?.message ?? "Failed to send text message.",
          ),
      },
    );
  };

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title="Communications" />

      {/* ── Recipient Selection Card ── */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-5">
        {/* Class summary */}
        <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">
          Course Information
        </h3>

        {classDataLoading ? (
          <TableSkeleton />
        ) : (
          <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-100 dark:bg-zinc-900 px-5 py-3 border-b border-gray-200 dark:border-zinc-700">
              {course?.certifying_body?.name && (
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  ({course.certifying_body.name}){" "}
                </span>
              )}
              <span className="font-semibold text-base uppercase text-gray-800 dark:text-white">
                {course?.course_name}
              </span>
            </div>
            <InfoRow label="Date/Time">
              <div className="flex flex-col gap-0.5">
                {(classData?.data?.class_times ?? []).map((t, i) => (
                  <span key={i}>
                    {t.date} from {t.from} to {t.to}
                  </span>
                ))}
              </div>
            </InfoRow>
            <InfoRow label="Location">{trainingAddress || "—"}</InfoRow>
            <InfoRow label="Class Price">
              <span className="font-medium">
                ${fmt(classData?.data?.price)}
              </span>
            </InfoRow>
          </div>
        )}

        {/* Select all / none + count */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Check:</span>
            <button
              type="button"
              onClick={selectAll}
              className="text-blue-600 hover:underline"
            >
              All
            </button>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <button
              type="button"
              onClick={selectNone}
              className="text-blue-600 hover:underline"
            >
              None
            </button>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {totalRecipients} recipient{totalRecipients === 1 ? "" : "s"}{" "}
            selected
          </span>
        </div>

        {/* Recipients */}
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            {instructor && (
              <RecipientGroup title="Instructor">
                <RecipientRow
                  id={instructor.id}
                  phone={instructor.mobile_phone}
                  email={instructor.email}
                  name={formatPersonName(instructor)}
                  checked={selectedInstructorIds.includes(instructor.id)}
                  onToggle={toggleInstructor}
                />
              </RecipientGroup>
            )}

            {assistants.length > 0 && (
              <RecipientGroup title="Assistants" count={assistants.length}>
                {assistants.map(assistant => (
                  <RecipientRow
                    key={assistant.id}
                    id={assistant.id}
                    phone={assistant.mobile_phone}
                    email={assistant.email}
                    name={formatPersonName(assistant)}
                    checked={selectedAssistantIds.includes(assistant.id)}
                    onToggle={toggleAssistant}
                  />
                ))}
              </RecipientGroup>
            )}

            {students.length > 0 && (
              <RecipientGroup title="Students" count={students.length}>
                {students.map(student => (
                  <RecipientRow
                    key={student.id}
                    id={student.id}
                    phone={student.primary_phone}
                    email={student.email}
                    name={formatPersonName(student)}
                    checked={selectedStudentIds.includes(student.id)}
                    onToggle={toggleStudent}
                  />
                ))}
              </RecipientGroup>
            )}

            {!instructor && !assistants.length && !students.length && (
              <p className="text-sm text-gray-400 italic">
                No recipients found.
              </p>
            )}
          </div>
        )}

        {/* Resend confirmation */}
        <div className="flex justify-end pt-2 border-t dark:border-gray-700">
          <Button
            type="button"
            onClick={handleResendConfirmation}
            disabled={resendPending}
            className="h-8 text-sm font-medium text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-60"
          >
            {resendPending ? "Sending…" : "Resend Confirmation Emails"}
          </Button>
        </div>
      </div>

      {/* ── Send Emails Card ── */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">
          Send Emails
        </h3>

        <FormContainer form={emailForm} onSubmit={handleSendEmail}>
          <div className="flex flex-col gap-4">
            <Field label="From">
              <FormInput
                name="from"
                placeholder="noreply@example.com"
                rules={{ required: "From email is required" }}
              />
            </Field>

            <Field label="BCC">
              <FormInput name="bcc" placeholder="Comma-separated emails" />
            </Field>

            <Field label="Subject Line">
              <FormInput
                name="subject"
                placeholder="Enter subject"
                rules={{ required: "Subject is required" }}
              />
            </Field>

            <Field label="Body">
              <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                <RichTextEditor ref={emailBodyRef} />
              </div>
            </Field>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={emailPending}
                className="h-8 text-sm font-medium text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-60"
              >
                {emailPending ? "Sending…" : "Send Email"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>

      {/* ── Send Texts Card ── */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">
          Send Texts
        </h3>

        <FormContainer form={textForm} onSubmit={handleSendText}>
          <div className="flex flex-col gap-4">
            <Field label="Text Message">
              <textarea
                {...textForm.register("message", {
                  required: "Message is required",
                })}
                rows={4}
                placeholder="Enter your text message…"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-md p-3 text-sm text-gray-800 dark:text-white bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-brown/30 resize-none"
              />
              {textForm.formState.errors.message && (
                <p className="text-xs text-red-500 mt-1">
                  {textForm.formState.errors.message.message}
                </p>
              )}
            </Field>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={textPending}
                className="h-8 text-sm font-medium text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-60"
              >
                {textPending ? "Sending…" : "Send Text"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default SendCommunication;
