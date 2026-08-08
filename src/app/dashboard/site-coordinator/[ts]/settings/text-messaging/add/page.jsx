"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import { storeTextMessage } from "@/hooks/api/dashboardApi";
import TextMessageForm from "@/components/dashboard/text-messaging/TextMessageForm";

export default function AddTextMessagePage() {
  const router = useRouter();
  const { ts } = useParams();
  const { mutate, isPending } = storeTextMessage();

  const onSubmit = payload => {
    mutate(
      { data: payload },
      {
        onSuccess: res => {
          toast.success(res?.message || "Message added successfully");
          router.push(`/dashboard/super-admin/${ts}/settings/text-messaging`);
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add Text Message" />
      <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm">
        <TextMessageForm onSubmit={onSubmit} isPending={isPending} />
      </div>
    </section>
  );
}
