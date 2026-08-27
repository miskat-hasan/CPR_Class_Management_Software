"use client";

import React from "react";
import SectionTitle from "@/components/common/SectionTitle";
import PromoCodeForm from "./PromoCodeForm";
import { getSinglePromoCode, updatePromoCode } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";

const EditPromoCodesPage = ({ id }) => {
  const { data: promoCodeData, isLoading: promoCodeDataLoading } =
    getSinglePromoCode(id);

  const { mutate, isPending } = updatePromoCode();

  const onSubmit = formData => {
    mutate(formData, {
      onSuccess: data => {
        toast.success(data?.message || "Promo Code updated successfully");
      },
      onError: error => {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    });
  };
  if (promoCodeDataLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="Edit Promo Code" />
        <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-brown rounded-full animate-spin" />
            <span className="text-sm">Loading Promo Code data…</span>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      <SectionTitle title="Edit Promo Code" />
      <PromoCodeForm
        id={id}
        initialData={promoCodeData?.data}
        isLoading={promoCodeDataLoading}
        onSubmit={onSubmit}
        isPending={isPending}
        submitLabel="Save Changes"
      />
    </section>
  );
};

export default EditPromoCodesPage;
