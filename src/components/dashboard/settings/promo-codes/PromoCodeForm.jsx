"use client";

import React, { useEffect } from "react";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "@/components/shared/form/CustomSelect";
import BackButton from "@/components/common/BackButton";
import { getAllClient } from "@/hooks/api/dashboardApi";

const defaultValues = {
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
};

const PromoCodeForm = ({
  id,
  initialData,
  isLoading,
  onSubmit,
  isPending,
  submitLabel = "Save Changes",
  title,
}) => {
  const isEditMode = Boolean(id);

  const form = useForm({
    defaultValues,
  });

  const {
    reset,
    control,
    register,
    watch,
    formState: { errors },
  } = form;

  const { data: clientData, isLoading: clientDataLoading } = getAllClient();

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && initialData) {
      reset({
        code: initialData.code || "",
        client_id: initialData.client_id || "",
        description: initialData.description || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        discount_type: initialData.type || "",
        discount: initialData.discount || "",
        max_uses: initialData.max_uses || "",
        apply_to_addons_and_shipping: Boolean(
          Number(initialData.apply_to_addons_and_shipping),
        ),
        restrict_by_course_type: Boolean(
          Number(initialData.restrict_by_course_type),
        ),
        does_not_reduce_balance_due: Boolean(
          Number(initialData.does_not_reduce_balance_due),
        ),
      });
    }
  }, [initialData, isEditMode, reset]);

  const handleSubmit = data => {
    const formData = new FormData();

    if (isEditMode) {
      formData.append("id", id);
    }

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

    onSubmit(formData);
  };

  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 shadow-sm">
        <FormContainer
          className="flex flex-col lg:gap-4"
          form={form}
          onSubmit={handleSubmit}
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
            <FormInput
              name="code"
              label="Code"
              placeholder="Product Code here"
              rules={{ required: "Code is required" }}
              error={errors.code?.message}
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
              rules={{ required: "Start date is required" }}
              error={errors.start_date?.message}
            />

            <FormInput
              name="end_date"
              label="End Date"
              type="date"
              placeholder="01/12/2005"
              rules={{
                required: "End date is required",
                validate: value => {
                  const startDate = watch("start_date");
                  if (!startDate) return true;
                  if (new Date(value) < new Date(startDate)) {
                    return "End date cannot be before start date";
                  }
                  return true;
                },
              }}
              error={errors.end_date?.message}
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
                  {...register("discount_type", {
                    required: "Discount type is required",
                  })}
                  className="accent-brown"
                />
                Dollars off
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  type="radio"
                  value="percentage_off"
                  {...register("discount_type", {
                    required: "Discount type is required",
                  })}
                  className="accent-brown"
                />
                Percentage off
              </label>
            </div>
            {errors.discount_type && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.discount_type.message}
              </p>
            )}
          </div>

          {/* Discount & Uses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2.5 md:gap-x-6 md:gap-y-5">
            <FormInput
              name="discount"
              label="Discount"
              placeholder="Discount"
              type="number"
              rules={{
                required: "Discount is required",
                min: { value: 0, message: "Discount must be at least 0" },
              }}
              error={errors.discount?.message}
            />
            <FormInput
              name="max_uses"
              label="# of uses"
              placeholder="uses"
              type="number"
              rules={{
                required: "Number of uses is required",
                min: { value: 1, message: "Must be at least 1" },
              }}
              error={errors.max_uses?.message}
            />
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
              {isPending ? "Saving..." : submitLabel}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default PromoCodeForm;
