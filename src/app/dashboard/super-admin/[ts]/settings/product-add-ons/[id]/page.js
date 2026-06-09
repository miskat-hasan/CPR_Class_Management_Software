"use client";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  getSingleProductAddOns,
  updateProductAddOns,
} from "@/hooks/api/dashboardApi";
import Link from "next/link";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";

const Page = ({ params }) => {
  const { id } = params;

  const form = useForm({
    defaultValues: {},
  });

  const { reset, register, control } = form;

  const {
    mutate: updateProductAddOnsMutation,
    isPending: productAddOnsPending,
  } = updateProductAddOns(id);

  const { data: productAddOnsData, isLoading: productAddOnsLoading } =
    getSingleProductAddOns(id);

  console.log("productAddOnsData", productAddOnsData?.data?.display_order);

  useEffect(() => {
    if (productAddOnsData) {
      reset({
        name: productAddOnsData?.data?.name || "",
        productCode: productAddOnsData?.data?.product_code || "",
        description: productAddOnsData?.data?.description || "",
        displayOrder: String(productAddOnsData?.data?.display_order) || "",
        shipping_type: productAddOnsData?.data?.type || "",
        price: productAddOnsData?.data?.price || "",
      });
    }
  }, [productAddOnsData, reset]);

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("product_code", data.productCode);
    formData.append("description", data.description);
    formData.append("display_order", data.displayOrder);
    formData.append("type", data.shipping_type);
    formData.append("price", data.price);
    formData.append("id", id);

    updateProductAddOnsMutation(formData, {
      onSuccess: (data) => {
       toast.success(data?.message || "Product Add-on updated successfully");
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
                  ]}
                />
              )}
            />
          </div>
          <FormInput name="price" label="Price" placeholder="Price" />

          <div className="flex flex-col gap-1 lg:gap-2  lg:mt-2">
            <p className="font-semibold text-[15px] text-gray-700">Type</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="shippable"
                  {...register("shipping_type")}
                  className="accent-brown"
                />
                Shippable Item
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="non_shippable"
                  {...register("shipping_type")}
                  className="accent-brown"
                />
                Non-shippable Item
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="digital"
                  {...register("shipping_type")}
                  className="accent-brown"
                />
                Digital Item
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1 lg:gap-2 lg:mt-2">
            <p className="font-semibold text-[15px] text-gray-700">Options</p>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-brown" />
              Default the selection to yes for all registrations
            </label>
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-5 lg:mt-10">
            <Button
              asChild={true}
              className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
            >
              <Link href={"../product_add_ons"}>Back</Link>
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown "
            >
              {productAddOnsPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default Page;
