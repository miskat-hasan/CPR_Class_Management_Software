"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import {
  getSingleTextMessage,
  updateTextMessage,
} from "@/hooks/api/dashboardApi";
import TextMessageForm from "@/components/dashboard/text-messaging/TextMessageForm";

export default function EditTextMessagePage() {
  const router = useRouter();
  const { ts, messageId } = useParams();

  const { data, isLoading } = getSingleTextMessage(messageId);
  const { mutate, isPending } = updateTextMessage(messageId);

  const msgData = data?.data;
  const defaultValues = msgData
    ? {
        active: msgData.active ?? false,
        days: String(msgData.days ?? ""),
        daysType: msgData.days_type ?? "before",
        messageName: msgData.message_name ?? "",
        message: msgData.message ?? "",
        dontSendOnRenewal: msgData.dont_send_renewal_class ?? false,
        sendToAllCourse: msgData.send_to_all_course ?? true,
        courseIds: (msgData.courses ?? []).map(c => String(c.id)),
        testMessage: msgData.test_message ?? "",
      }
    : null;

  const onSubmit = payload => {
    mutate(
      { data: payload },
      {
        onSuccess: res => {
          toast.success(res?.message || "Message updated successfully");
          router.push(`/dashboard/super-admin/${ts}/settings/text-messaging`);
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
      <SectionTitle title="Edit Text Message" />
      <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm">
        <TextMessageForm
          defaultValues={defaultValues}
          messageId={messageId}
          onSubmit={onSubmit}
          isPending={isPending}
          isEdit={true}
        />
      </div>
    </section>
  );
}
