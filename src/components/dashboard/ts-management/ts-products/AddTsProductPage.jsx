"use client";
import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { useStoreTCProduct } from "@/hooks/api/dashboardApi";
import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const AddTsProductPage = () => {
  const form = useForm({
    defaultValues: {
      code: "",
      name: "",
      price_label: "",
      price: "",
      is_taxable: 0,
    },
  });
  const { control, register, reset, formState: { errors } } = form;

  const { mutate, isPending } = useStoreTCProduct();

  const onSubmit = data => {
    const formData = new FormData();

    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("price_label", data.price_label);
    formData.append("price", data.price);
    formData.append("is_taxable", Number(data.is_taxable));

    mutate(formData, {
      onSuccess: data => {
        reset();
        toast.success(data?.message || "TC Product added successfully");
      },
    });
  };

  return (
    <div>
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SectionTitle title={"Add TC Product"} />
        <FormContainer
          className={"flex flex-col  lg:gap-4"}
          form={form}
          onSubmit={onSubmit}
        >
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
            <FormInput
              name="code"
              label="Product Code"
              placeholder="Enter Product Code"
            />

            <FormInput
              name="name"
              label="Product Name"
              placeholder="Enter Product Name"
            />

            <Controller
              name="price_label"
              control={control}
              rules={{ required: "Price Level is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="price_label"
                  label="Price Level"
                  placeholder="Select Price Level"
                  options={Array.from({ length: 19 }, (_, i) => ({
                    id: String(i + 1),
                    name: String(i + 1),
                  }))}
                  error={errors.price_label?.message}
                />
              )}
            />
            <FormInput name="price" label="Price" placeholder="Price" />
          </div>
          <div className="flex flex-col gap-1 lg:gap-2 lg:mt-2">
            <p className="font-semibold text-[15px] text-gray-700">Options</p>

            <label className="flex items-center gap-2 text-sm">
              <input
                {...register("is_taxable")}
                type="checkbox"
                className="accent-brown"
              />
              Taxable
            </label>
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-5 lg:mt-10">
            <BackButton />
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown  disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default AddTsProductPage;
