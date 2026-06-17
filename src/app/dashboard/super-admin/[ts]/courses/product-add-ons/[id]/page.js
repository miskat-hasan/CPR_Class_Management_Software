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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Page({ params }) {
  const { id } = params;
  const router = useRouter();
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
