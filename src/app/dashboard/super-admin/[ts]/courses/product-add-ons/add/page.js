"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import ProductAddOnForm from "@/components/dashboard/courses/product-add-ons/ProductAddOnForm";
import { useForm } from "react-hook-form";
import { storeProductAddOns } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
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

  const { mutate, isPending } = storeProductAddOns();

  const onSubmit = data => {
    const payload = {
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
          toast.success(res?.message || "Product Add-on added successfully");
          reset();
          router.back();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add Product Add-on" />
      <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm">
        <FormContainer form={form} onSubmit={onSubmit}>
          <ProductAddOnForm
            control={control}
            register={register}
            isPending={isPending}
          />
        </FormContainer>
      </div>
    </section>
  );
}
