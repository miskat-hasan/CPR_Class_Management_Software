"use client";

import SectionTitle from "@/components/common/SectionTitle";
import ClassForm from "@/components/dashboard/class/ClassForm";
import { storeClass } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ScheduleClassPage() {
  const router = useRouter();
  const { ts } = useParams();
  const { selectedTrainingSiteId } = useAuth();

  const { mutate, isPending } = storeClass();

  const onSubmit = formData => {
    formData.append("training_site_id", selectedTrainingSiteId);
    mutate(formData, {
      onSuccess: res => {
        toast.success(res?.message || "Class scheduled successfully");
        router.push(
          `/dashboard/super-admin/${ts}/class-and-students/upcoming-classes`,
        );
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <div className="flex flex-col gap-[10px] lg:gap-[20px]">
      <SectionTitle title="Schedule a Class" />
      <div className="bg-white dark:bg-black p-4 lg:p-6 rounded-[14px] shadow">
        <ClassForm onSubmit={onSubmit} isPending={isPending} />
      </div>
    </div>
  );
}
