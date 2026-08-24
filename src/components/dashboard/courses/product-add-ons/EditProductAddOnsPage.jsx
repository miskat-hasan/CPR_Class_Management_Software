"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import ProductAddOnForm from "@/components/dashboard/courses/product-add-ons/ProductAddOnForm";
import { useForm } from "react-hook-form";
import {
  getSingleProductAddOns,
  updateProductAddOns,
} from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEffect } from "react";

export default function EditProductAddOnsPage({ id }) {
  const { selectedTrainingSiteId } = useAuth();

  const form = useForm({
    defaultValues: {
      productCode: "",
      name: "",
      description: "",
      displayOrder: "",
      price: "",
      quickbookName: "",
      type: "",
      keycodeBank: "",
      defaultSelection: false,
    },
  });
  const { control, register, reset } = form;

  const { data: productData, isLoading } = getSingleProductAddOns(id);
  const { mutate, isPending } = updateProductAddOns(id);

  useEffect(() => {
    if (!productData?.data) return;
    const d = productData.data;
    reset({
      productCode: d.product_code ?? "",
      name: d.name ?? "",
      description: d.description ?? "",
      displayOrder: String(d.display_order ?? ""),
      price: d.price ?? "",
      quickbookName: d.quickbook_name ?? "",
      type: d.type ?? "",
      keycodeBank: String(d.keycode_bank_id ?? ""),
      defaultSelection:
        d.default_selection === "1" || d.default_selection === 1,
    });
  }, [productData, reset]);

  const onSubmit = data => {
    const payload = {
      id: Number(id),
      training_site_id: selectedTrainingSiteId,
      product_code: data.productCode,
      name: data.name,
      description: data.description,
      display_order: data.displayOrder,
      price: data.price,
      type: data.type,
      quickbook_name: data.quickbookName,
      default_selection: data.defaultSelection ? "1" : "0",
      ...(data.type === "keycode" && {
        keycode_bank_id: data.keycodeBank,
      }),
    };

    mutate(
      { data: payload },
      {
        onSuccess: res => {
          toast.success(res?.message || "Product Add-on updated successfully");
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="Edit Product Add-on" />
        <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-brown rounded-full animate-spin" />
            <span className="text-sm">Loading Product Add-on data…</span>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Edit Product Add-on" />
      <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm">
        <FormContainer form={form} onSubmit={onSubmit}>
          <ProductAddOnForm
            control={control}
            register={register}
            isPending={isPending}
            isEdit={true}
          />
        </FormContainer>
      </div>
    </section>
  );
}
