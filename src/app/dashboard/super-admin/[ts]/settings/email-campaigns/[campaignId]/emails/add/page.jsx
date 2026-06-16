"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import EmailTemplateForm from "@/components/dashboard/settings/email-campaigns/EmailTemplateForm";
import { storeEmailTemplate } from "@/hooks/api/dashboardApi";

export default function AddEmailTemplatePage() {
  const router = useRouter();
  const { ts, campaignId } = useParams();

  const { mutate, isPending } = storeEmailTemplate(campaignId);

  const onSubmit = payload => {
    mutate(
      { data: payload },
      {
        onSuccess: res => {
          toast.success(res?.message || "Email added successfully");
          router.push(`/dashboard/super-admin/${ts}/settings/email-campaigns`);
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add Email" />
      <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm">
        <EmailTemplateForm onSubmit={onSubmit} isPending={isPending} />
      </div>
    </section>
  );
}
