// src/components/dashboard/send-communication/SendCommunication.jsx
"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SectionTitle from "@/components/common/SectionTitle";
import FormInput from "@/components/shared/form/FormInput";
import FormContainer from "@/components/shared/form/FormContainer";
import { Button } from "@/components/ui/button";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  getSingleClass,
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
    className="flex items-center gap-3 flex-wrap py-1 cursor-pointer"
  >
    <input
      type="checkbox"
      id={`recipient-${id}`}
      checked={checked}
      onChange={() => onToggle(id)}
      className="accent-brown"
    />
    <span className="text-sm text-gray-600 dark:text-gray w-[130px] shrink-0">
      {phone ?? "—"}
    </span>
    <span className="text-sm text-gray-700 dark:text-gray truncate max-w-[220px]">
      {email}
    </span>
    <span className="text-sm font-medium text-gray-900 dark:text-white">
      {name}
    </span>
  </label>
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

// ─── Main component ───────────────────────────────────────────────────────────
const SendCommunication = () => {
  const { id } = useParams();

  // recipient selection
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedInstructorIds, setSelectedInstructorIds] = useState([]);

  // rich-text ref for email body
  const emailBodyRef = useRef(null);

  // data
  
  const { data: studentData, isLoading } = useGetStudentByClassId(id);
  const students = studentData?.data?.students ?? [];
  
  const { data: classData, isLoading: classDataLoading } =
    getSingleClass(id);
  
  const instructors = classData?.data?.instructors ?? [];
  const classDetails = classData?.data ?? null;

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

  const selectAll = () => {
    setSelectedStudentIds(students.map(s => s.id));
    setSelectedInstructorIds(instructors.map(i => i.id));
  };

  const selectNone = () => {
    setSelectedStudentIds([]);
    setSelectedInstructorIds([]);
  };

  const hasRecipients =
    selectedStudentIds.length > 0 || selectedInstructorIds.length > 0;

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
        {/* Class info */}
        {classDetails && (
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5 pb-3 border-b dark:border-gray-700">
            <p>
              <span className="font-semibold">Class:</span>{" "}
              {classDetails.name ?? classDetails.course_name}
            </p>
            {classDetails.date && <p>{classDetails.date}</p>}
            {classDetails.location && <p>{classDetails.location}</p>}
          </div>
        )}

        {/* Select all / none */}
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

        {/* Recipients */}
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            {instructors.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Instructor
                </p>
                {instructors.map(inst => (
                  <RecipientRow
                    key={inst.id}
                    id={inst.id}
                    phone={inst.primary_phone}
                    email={inst.email}
                    name={`${inst.first_name} ${inst.last_name}`}
                    checked={selectedInstructorIds.includes(inst.id)}
                    onToggle={toggleInstructor}
                  />
                ))}
              </div>
            )}

            {students.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Students
                </p>
                {students.map(student => (
                  <RecipientRow
                    key={student.id}
                    id={student.id}
                    phone={student.primary_phone}
                    email={student.email}
                    name={`${student.first_name} ${student.last_name}`}
                    checked={selectedStudentIds.includes(student.id)}
                    onToggle={toggleStudent}
                  />
                ))}
              </div>
            )}

            {!instructors.length && !students.length && (
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
