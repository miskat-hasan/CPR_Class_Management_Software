// src/components/dashboard/clients/AddClientPage.jsx
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import ClientForm from "@/components/dashboard/clients/ClientForm";
import { storeClient } from "@/hooks/api/dashboardApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddClientPage = () => {
  const { mutateAsync: storeClientMutation, isPending } = storeClient();

  const router = useRouter();
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

export default AddClientPage;
