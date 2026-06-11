// src/app/dashboard/super-admin/[ts]/settings/external-sku/add/page.js
"use client";
import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { storeExternalSKU } from "@/hooks/api/dashboardApi";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const form = useForm();

  const { reset } = form;
  // store external sku mutation
  const {
    mutate: storeExternalSkuMutation,
    isPending: storeExternalSkuPending,
  } = storeExternalSKU();

  const onSubmit = (data) => {
    storeExternalSkuMutation(data, {
      onSuccess: (data) => {
        reset();
        toast.success(data?.message || "External SKU added successfully");
      },
    });
  };
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add External SKU" />

      <div className="px-1.5 py-3 min-[374px]:p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-3 lg:gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="name" label="Name" placeholder="name here" />
              <FormInput name="code" label="Code" placeholder="Code here" />
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <BackButton />
              <Button
                type="submit"
                disabled={storeExternalSkuPending}
                className="bg-brown dark:bg-dark-brown hover:bg-brown  text-white px-8 dark:hover:bg-brown"
              >
                {storeExternalSkuPending ? "Adding ..." : "Add External SKU"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default Page;
