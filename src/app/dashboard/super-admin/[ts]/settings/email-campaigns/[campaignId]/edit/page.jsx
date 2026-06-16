"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import CampaignForm from "@/components/dashboard/settings/email-campaigns/CampaignForm";
import {
  getSingleEmailCampaign,
  updateEmailCampaign,
} from "@/hooks/api/dashboardApi";

export default function EditCampaignPage() {
  const router = useRouter();
  const { ts, campaignId } = useParams();

  const { data, isLoading } = getSingleEmailCampaign(campaignId);
  const { mutate, isPending } = updateEmailCampaign(campaignId);

  const campaignData = data?.data;

  // Map API response → form shape
  const defaultValues = campaignData
    ? {
        name: campaignData.name ?? "",
        mailFromAddress: campaignData.mail_from_address ?? "",
        mailFromDisplayName: campaignData.mail_from_display_name ?? "",
        bccMailTo: (campaignData.bcc_mail_to ?? []).join(", "),
        active: campaignData.option === "active",
        stopOnRenewal: campaignData.option === "stop_on_renewal",
        sendToAllCourse: campaignData.send_to_all_course ?? true,
        courseIds: (campaignData.courses ?? []).map(c => String(c.id)),
      }
    : null;

  const onSubmit = payload => {
    mutate(
      { data: payload },
      {
        onSuccess: res => {
          toast.success(res?.message || "Campaign updated successfully");
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
      <SectionTitle title="Edit Email Campaign" />
      <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm">
        <CampaignForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isPending={isPending}
          isEdit={true}
        />
      </div>
    </section>
  );
}
