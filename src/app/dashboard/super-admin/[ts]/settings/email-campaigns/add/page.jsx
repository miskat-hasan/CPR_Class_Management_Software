"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import CampaignForm from "@/components/dashboard/settings/email-campaigns/CampaignForm";
import { storeEmailCampaign } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";

export default function AddCampaignPage() {
  const router = useRouter();
  const { ts } = useParams();
  const { selectedTrainingSiteId } = useAuth();

  const { mutate, isPending } = storeEmailCampaign();

  const onSubmit = payload => {
    mutate(
      { data: { ...payload, training_site_id: selectedTrainingSiteId } },
      {
        onSuccess: res => {
          toast.success(res?.message || "Campaign created successfully");
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
      <SectionTitle title="Add Email Campaign" />
      <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm">
        <CampaignForm onSubmit={onSubmit} isPending={isPending} />
      </div>
    </section>
  );
}
