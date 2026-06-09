"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormTextarea from "@/components/shared/form/FormTextarea";
import Link from "next/link";
import { getAllClient, storePromoCode } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import BackButton from "@/components/common/BackButton";

const Page = () => {
  const form = useForm({
    defaultValues: {
      // restrict_course_ids: [],
      code: "",
      client_id: "",
      description: "",
      start_date: "",
      end_date: "",
      discount_type: "",
      discount: "",
      max_uses: "",
      apply_to_addons_and_shipping: false,
      restrict_by_course_type: false,
      does_not_reduce_balance_due: false,
    },
  });

  const {
    reset,
    control,
    register,
    formState: { errors },
  } = form;

  const { data: clientData, isLoading: clientDataLoading } = getAllClient();

  const { mutate, isPending } = storePromoCode();

  const onSubmit = data => {
    const formData = new FormData();

    formData.append("code", data.code);
    formData.append("client_id", data.client_id);
    formData.append("description", data.description);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("type", data.discount_type);
    formData.append("discount", data.discount);
    formData.append("max_uses", data.max_uses);
    formData.append(
      "apply_to_addons_and_shipping",
      Number(data.apply_to_addons_and_shipping),
    );
    formData.append(
      "restrict_by_course_type",
      Number(data.restrict_by_course_type),
    );
    formData.append(
      "does_not_reduce_balance_due",
      Number(data.does_not_reduce_balance_due),
    );

    // data?.restrict_course_ids?.forEach((id) => {
    //   formData.append("restrict_course_ids[]", id);
    // });

    mutate(formData, {
      onSuccess: data => {
        reset();
        toast.success(data?.message || "Promo Code added successfully");
      },
      onError: error => {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      {/* Title */}
      <SectionTitle title="Add Promo Code" />
      {/* White/Dark Form Card */}
      <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 shadow-sm">
        <FormContainer
          className={"flex flex-col lg:gap-4"}
          form={form}
          onSubmit={onSubmit}
        >
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
            <FormInput
              name="code"
              label="Code"
              placeholder="Product Code here"
            />

            <Controller
              name="client_id"
              control={control}
              rules={{ required: "Client is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="client_id"
                  label="Client"
                  placeholder="Client"
                  isLoading={clientDataLoading}
                  options={clientData?.data?.data}
                  error={errors.client_id?.message}
                  className="flex-1"
                />
              )}
            />
            <FormInput
              name="description"
              label="Description"
              placeholder="Description"
            />
            <FormInput
              name="start_date"
              label="Start Date"
              type="date"
              placeholder="01/02/2005"
            />
            <FormInput
              name="end_date"
              label="End Date"
              type="date"
              placeholder="01/12/2005"
            />
          </div>
          {/* Type Radio Group */}
          <div className="flex flex-col gap-1 lg:gap-2 lg:mt-2">
            <p className="font-semibold text-[15px] text-gray-700 dark:text-gray">
              Type
            </p>
            <div className="flex flex-col gap-2 dark:text-gray">
              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  type="radio"
                  value="dollars_off"
                  {...register("discount_type")}
                  className="accent-brown"
                />
                Dollars off
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  type="radio"
                  value="percentage_off"
                  {...register("discount_type")}
                  className="accent-brown"
                />
                Percentage off
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
            <FormInput
              name="discount"
              label="Discount"
              placeholder="Discount"
            />
            <FormInput name="max_uses" label="# of uses" placeholder="uses" />
          </div>

          {/* Options Checkboxes */}
          <div className="flex flex-col gap-1 lg:gap-2 lg:mt-2">
            <p className="font-semibold text-[15px] text-gray-700 dark:text-gray">
              Options
            </p>
            <div className="flex flex-col gap-2 dark:text-gray">
              <label className="inline-flex w-fit items-center gap-2 text-[12px] sm:text-sm cursor-pointer">
                <input
                  {...register("apply_to_addons_and_shipping")}
                  type="checkbox"
                  className="accent-brown"
                />
                Apply the discount to add-on purchases and shipping also
              </label>
              <label className="inline-flex w-fit items-center gap-2 text-[12px] sm:text-sm cursor-pointer">
                <input
                  {...register("restrict_by_course_type")}
                  type="checkbox"
                  className="accent-brown"
                />
                Restrict use by course type
              </label>
              <label className="inline-flex w-fit items-center gap-2 text-[12px] sm:text-sm cursor-pointer">
                <input
                  {...register("does_not_reduce_balance_due")}
                  type="checkbox"
                  className="accent-brown"
                />
                Does not reduce the balance due - deferred payment only
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-5 lg:mt-10">
            <BackButton />
            <Button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown dark:hover:bg-brown"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default Page;
