"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import EmailTemplateForm from "@/components/dashboard/settings/email-campaigns/EmailTemplateForm";
import {
  getSingleEmailTemplate,
  updateEmailTemplate,
} from "@/hooks/api/dashboardApi";

export default function EditEmailTemplatePage() {
  const router = useRouter();
  const { ts, emailId } = useParams();

  const { data, isLoading } = getSingleEmailTemplate(emailId);
  const { mutate, isPending } = updateEmailTemplate(emailId);

  const emailData = data?.data;
  const defaultValues = emailData
    ? {
        days: String(emailData.days ?? ""),
        daysType: emailData.days_type ?? "before",
        body: emailData.body ?? "",
        subject: emailData.subject ?? "",
        testEmail: emailData.test_email ?? "",
      }
    : null;

  const onSubmit = payload => {
    mutate(
      { data: payload },
      {
        onSuccess: res => {
          toast.success(res?.message || "Email updated successfully");
          router.push(`/dashboard/super-admin/${ts}/settings/email-campaigns`);
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  if (isLoading) return null;

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Edit Email" />
      <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm">
        <EmailTemplateForm
          defaultValues={defaultValues}
          emailId={emailId}
          onSubmit={onSubmit}
          isPending={isPending}
          isEdit={true}
        />
      </div>
    </section>
  );
}
