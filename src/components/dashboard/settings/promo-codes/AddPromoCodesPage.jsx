"use client";

import React from "react";
import SectionTitle from "@/components/common/SectionTitle";
import PromoCodeForm from "./PromoCodeForm";
import { storePromoCode } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddPromoCodesPage = () => {
  const router = useRouter();
  const { mutate, isPending } = storePromoCode();

  const onSubmit = formData => {
    mutate(formData, {
      onSuccess: data => {
        toast.success(data?.message || "Promo Code added successfully");
        router.back();
      },
      onError: error => {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      <SectionTitle title="Add Promo Code" />
      <PromoCodeForm
        onSubmit={onSubmit}
        isPending={isPending}
        submitLabel="Save Changes"
      />
    </section>
  );
};

export default AddPromoCodesPage;
