// src/app/dashboard/super-admin/[ts]/training-center/training-sites/add/page.js
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import TrainingSiteForm from "@/components/dashboard/trainingSites/TrainingSiteForm";
import { createSingleTrainingSite } from "@/hooks/api/dashboardApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = createSingleTrainingSite();

  const onSubmit = async (payload, { reset, notesRef }) => {
    try {
      const res = await mutateAsync({ data: payload });
      if (res?.status) {
        toast.success(res?.message || "Training site created successfully!");
        reset();
        notesRef.current?.clear?.();
        router.back();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add Training Site" />
      <TrainingSiteForm
        onSubmit={onSubmit}
        isPending={isPending}
        isEdit={false}
      />
    </section>
  );
};

export default Page;
