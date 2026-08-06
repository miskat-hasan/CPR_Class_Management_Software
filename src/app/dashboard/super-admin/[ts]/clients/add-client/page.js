// src/app/dashboard/super-admin/[ts]/clients/add-client/page.js
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import ClientForm from "@/components/dashboard/clients/ClientForm";
import { storeClient } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";

const Page = () => {
  const { mutateAsync: storeClientMutation, isPending } = storeClient();

  const onSubmit = async (
    formData,
    { reset, sharedNotesRef, internalNotesRef },
  ) => {
    await storeClientMutation(formData, {
      onSuccess: data => {
        toast.success(data?.message || "Client added successfully");
        reset();
        sharedNotesRef.current?.clear?.();
        internalNotesRef.current?.clear?.();
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      <SectionTitle title={"Add Client"} />
      <ClientForm onSubmit={onSubmit} isPending={isPending} isEdit={false} />
    </section>
  );
};

export default Page;
