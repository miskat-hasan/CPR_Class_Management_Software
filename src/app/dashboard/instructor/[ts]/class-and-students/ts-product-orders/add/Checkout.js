"use client";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  useGetSingleTCProduct,
  useUpdateTCProduct,
} from "@/hooks/api/dashboardApi";
import Link from "next/link";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const Checkout = ({ params }) => {
  const { id } = params;

  const form = useForm({
    defaultValues: {
      code: "",
      name: "",
      price_label: "",
      price: "",
      is_taxable: 0,
    },
  });

  const { reset, register, control } = form;

  // get ts product data
  const { data: productData, isLoading } = useGetSingleTCProduct(id);

  // price level
  const priceLevel = Array.from({ length: 19 }, (_, i) => ({
    id: String(i + 1),
    name: String(i + 1),
  }));

  // reset data
  useEffect(() => {
    if (productData && priceLevel) {
      reset({
        code: productData?.data?.code || "",
        name: productData?.data?.name || "",
        price_label: productData?.data?.price_label || "",
        price: productData?.data?.price || "",
        is_taxable: productData?.data?.is_taxable || "",
      });
    }
  }, [productData, reset]);

  // update product data
  const { mutate, isPending } = useUpdateTCProduct(id);

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("price_label", data.price_label);
    formData.append("price", data.price);
    formData.append("is_taxable", Number(data.is_taxable));

    mutate(formData);
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
                  options={priceLevel}
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
            <Button
              asChild={true}
              className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
            >
              <Link href={"../tc_products"}>Back</Link>
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown  disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default Checkout;
