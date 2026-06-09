"use client";
import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { storeProductAddOns } from "@/hooks/api/dashboardApi";
import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      productCode: "",
      description: "",
      displayOrder: "",
      type: "",
      price: "",
    },
  });
  const { control, register, reset } = form;

  const { mutate, isPending } = storeProductAddOns();

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("product_code", data.productCode);
    formData.append("description", data.description);
    formData.append("display_order", data.displayOrder);
    formData.append("type", data.shipping_type);
    formData.append("price", data.price);

    mutate(formData, {
      onSuccess: (data) => {
        reset();
        toast.success(data?.message || "Product Add-on added successfully");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <div>
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <FormContainer
          className={"flex flex-col  lg:gap-4"}
          form={form}
          onSubmit={onSubmit}
        >
          <SectionTitle title={"Product Add-ons"} />
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
            <FormInput
              name="productCode"
              label="Product Code"
              placeholder="Product Code here"
            />

            <FormInput name="name" label="Name" placeholder="Enter name" />
            <FormInput
              name="description"
              label="Description"
              placeholder="Description / Notes here"
            />

            <Controller
              name="displayOrder"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="display_order"
                  label="Display Order"
                  placeholder="Select Display Order"
                  options={[
                    {
                      id: "1",
                      name: "1",
                    },
                    {
                      id: "2",
                      name: "2",
                    },
                    {
                      id: "3",
                      name: "3",
                    },
                    {
                      id: "4",
                      name: "4",
                    },
                    {
                      id: "5",
                      name: "5",
                    },
                    {
                      id: "6",
                      name: "6",
                    },
                    {
                      id: "7",
                      name: "7",
                    },
                    {
                      id: "8",
                      name: "8",
                    },
                    {
                      id: "9",
                      name: "9",
                    },
                    {
                      id: "10",
                      name: "10",
                    },
                    {
                      id: "n/a",
                      name: "N/A",
                    },
                  ]}
                />
              )}
            />
            <FormInput name="price" label="Price" placeholder="Price" />
            <FormInput
              name="quick-books"
              label="QuickBooks Item Name"
              placeholder="Enter QuickBooks Item Name"
            />
          </div>

          <div className="flex flex-col gap-1 lg:gap-2  lg:mt-2">
            <p className="font-semibold text-[15px] text-gray-700 dark:text-gray">
              Type
            </p>
            <div className="flex flex-col gap-2 dark:text-gray">
              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  type="radio"
                  value="shippable"
                  {...register("shipping_type")}
                  className="accent-brown"
                />
                Shippable Item
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  type="radio"
                  value="non_shippable"
                  {...register("shipping_type")}
                  className="accent-brown"
                />
                Non-shippable Item
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  type="radio"
                  value="digital"
                  {...register("shipping_type")}
                  className="accent-brown"
                />
                KeyCode
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1 lg:gap-2 lg:mt-2">
            <p className="font-semibold text-[15px] text-gray-700 dark:text-gray">
              Options
            </p>

            <label className="inline-flex w-fit items-center gap-2 text-sm dark:text-gray cursor-pointer">
              <input type="checkbox" className="accent-brown" />
              Default the selection to &quot;yes&quot; for all registrations
            </label>
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-5 lg:mt-10">
            <BackButton />
            <Button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown dark:hover:bg-brown"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default Page;
