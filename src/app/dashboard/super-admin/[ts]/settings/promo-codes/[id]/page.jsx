"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormTextarea from "@/components/shared/form/FormTextarea";
import Link from "next/link";
import {
  getAllClient,
  getSinglePromoCode,
  storePromoCode,
  updatePromoCode,
} from "@/hooks/api/dashboardApi";
import Swal from "sweetalert2";
import { toast } from "sonner";

const Page = ({ params }) => {
  const { id } = params;

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

  const { data: promoCodeData, isLoading: promoCodeDataLoading } =
    getSinglePromoCode(id);

  const { mutate, isPending } = updatePromoCode();

  useEffect(() => {
  if (promoCodeData?.data) {
    reset({
      // restrict_course_ids: promoCodeData.data.restrict_course_ids || [],
      code: promoCodeData.data.code || "",
      client_id: promoCodeData.data.client_id || "",
      description: promoCodeData.data.description || "",
      start_date: promoCodeData.data.start_date || "",
      end_date: promoCodeData.data.end_date || "",
      discount_type: promoCodeData.data.type || "",
      discount: promoCodeData.data.discount || "",
      max_uses: promoCodeData.data.max_uses || "",
      apply_to_addons_and_shipping: Boolean(
        Number(promoCodeData.data.apply_to_addons_and_shipping)
      ),
      restrict_by_course_type: Boolean(
        Number(promoCodeData.data.restrict_by_course_type)
      ),
      does_not_reduce_balance_due: Boolean(
        Number(promoCodeData.data.does_not_reduce_balance_due)
      ),
    });
  }
}, [promoCodeData, reset]);

  

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("id", id);
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
      Number(data.apply_to_addons_and_shipping)
    );
    formData.append(
      "restrict_by_course_type",
      Number(data.restrict_by_course_type)
    );
    formData.append(
      "does_not_reduce_balance_due",
      Number(data.does_not_reduce_balance_due)
    );

    // data?.restrict_course_ids?.forEach((id) => {
    //   formData.append("restrict_course_ids[]", id);
    // });

    mutate(formData, {
      onSuccess: (data) => {
        reset();
        toast.success(data?.message || "Promo Code updated successfully");
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      {/* Title */}
      <SectionTitle title="Edit Promo Code" />
      {/* White Form Card */}
      <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 shadow-sm">
        <FormContainer form={form} onSubmit={onSubmit}>
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
          </div>
          <FormInput
            name="end_date"
            label="End Date"
            type="date"
            placeholder="01/12/2005"
          />
          <div className="flex flex-col gap-2 mt-2 lg:mt-4">
            <p className="font-semibold text-[15px] text-gray-700">Type</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="dollars_off"
                  {...register("discount_type")}
                  className="accent-brown"
                />
                Dollars off
              </label>

              <label className="flex items-center gap-2 text-sm">
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
          <FormInput name="discount" label="Discount" placeholder="Discount" />
          <FormInput name="max_uses" label="# of uses" placeholder="uses" />
          <div className="flex flex-col gap-2 mt-2 lg:mt-4">
            <p className="font-semibold text-[15px] text-gray-700">Options</p>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-[12px] sm:text-sm">
                <input
                  {...register("apply_to_addons_and_shipping")}
                  type="checkbox"
                  className="accent-brown"
                />
                Apply the discount to add-on purchases and shipping also
              </label>
              <label className="flex items-center gap-2 text-[12px] sm:text-sm">
                <input
                  {...register("restrict_by_course_type")}
                  type="checkbox"
                  className="accent-brown"
                />
                Restrict use by course type
              </label>
              <label className="flex items-center gap-2 text-[12px] sm:text-sm">
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
            <Button
              asChild={true}
              className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
            >
              <Link href={"../promo_codes"}>Back</Link>
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown "
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
