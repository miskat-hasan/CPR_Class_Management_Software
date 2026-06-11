"use client";

import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  getAllCardType,
  getCardSettings,
  updateCardSettings,
} from "@/hooks/api/dashboardApi";

import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";

const Page = () => {
  const { data: cardTypeData, isLoading: cardTypeLoading } = getAllCardType();

  const { data: cardSettingsData, isLoading: cardSettingsDataLoading } =
    getCardSettings();

  const form = useForm({
    defaultValues: {
      name: cardSettingsData?.data.name || "",
      card_type_id: cardSettingsData?.data.card_type_id || "",
      training_ctr: cardSettingsData?.data.training_ctr || "",
      tc_info: cardSettingsData?.data.tc_info || "",
      location: cardSettingsData?.data.location || "",
      card_1: cardSettingsData?.data.card_1 || "",
      card_2: cardSettingsData?.data.card_2 || "",
      card_3: cardSettingsData?.data.card_3 || "",
      is_default: Boolean(Number(cardSettingsData?.data.is_default)),
    },
  });

  const {
    control,
    register,
    reset,
    formState: { errors },
  } = form;

  const { mutate, isPending } = updateCardSettings();

  useEffect(() => {
    if (cardSettingsData?.data && cardTypeData?.data) {
      reset({
        name: cardSettingsData.data.name || "",
        card_type_id: cardSettingsData.data.card_type_id || "",
        training_ctr: cardSettingsData.data.training_ctr || "",
        tc_info: cardSettingsData.data.tc_info || "",
        location: cardSettingsData?.data.location || "",
        card_1: cardSettingsData.data.card_1 || "",
        card_2: cardSettingsData.data.card_2 || "",
        card_3: cardSettingsData.data.card_3 || "",
        is_default: Boolean(Number(cardSettingsData.data.is_default)),
      });
    }
  }, [cardSettingsData, reset, cardTypeData]);

  const onSubmit = data => {
    const formData = new FormData();

    formData.append("id", 1);
    formData.append("name", data?.name);
    formData.append("card_type_id", data?.card_type_id);
    formData.append("training_ctr", data?.training_ctr);
    formData.append("tc_info", data?.tc_info);
    formData.append("location", data?.location);
    formData.append("card_1", data?.card_1);
    formData.append("card_2", data?.card_2);
    formData.append("card_3", data?.card_3);
    formData.append("is_default", Number(data?.is_default));

    mutate(formData, {
      onSuccess: data => {
        toast.success(data?.message || "Card Settings Updated Successfully");
      },
      onError: error => {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title={"Certification Card Settings"} />
      <div className="px-1.5 py-3 min-[374px]:p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle
          className={"!text-[18px] lg:!text-2xl dark:text-white"}
          subtitle={"Setting Profile"}
        />
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
            <FormInput
              name="name"
              label="Profile Name"
              placeholder="Profile Name Here"
            />

            <Controller
              name="card_type_id"
              control={control}
              rules={{ required: "Card Type is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="card_type_id"
                  label="Card Type"
                  placeholder="Card Type here"
                  options={cardTypeData?.data?.data}
                  isLoading={cardTypeLoading}
                  error={errors.card_type_id?.message}
                  className="flex-1"
                />
              )}
            />
            <FormInput
              name="training_ctr"
              label="Training Ctr"
              placeholder="Training Ctr here"
            />

            <FormInput
              name="tc_info"
              label="TC Info"
              placeholder="TC Info here"
            />
          </div>

          <div className="mt-3 lg:mt-6">
            <FormInput
              name="location"
              label="Course Location"
              placeholder="Course Location here"
            />
          </div>

          <div className="leading-[1.45] font-semibold text-sm sm:text-base text-gray-700 dark:text-white mt-5 mb-2">
            Card Alignment Adjustments
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-6 bg-neutral-50 dark:bg-neutral-900 border border-gray-200 dark:border-zinc-800 shadow rounded-xl p-4">
            <Controller
              name="card_1"
              control={control}
              rules={{ required: "Card Type is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="card_1"
                  label="Card 1"
                  placeholder="Card Type here"
                  options={[
                    { id: `Up 1/4"`, name: `Up 1/4"` },
                    { id: `Up 3/16"`, name: `Up 3/16"` },
                    { id: `Up 1/8"`, name: `Up 1/8"` },
                    { id: `None`, name: `None` },
                    { id: `Down 1/8"`, name: `Down 1/8"` },
                    { id: `Down 3/16"`, name: `Down 3/16"` },
                    { id: `Down 1/4"`, name: `Down 1/4"` },
                  ]}
                  error={errors.card_1?.message}
                  className="flex-1"
                />
              )}
            />
            <Controller
              name="card_2"
              control={control}
              rules={{ required: "Card Type is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="card_2"
                  label="Card 2"
                  placeholder="Card Type here"
                  options={[
                    { id: `Up 1/4"`, name: `Up 1/4"` },
                    { id: `Up 3/16"`, name: `Up 3/16"` },
                    { id: `Up 1/8"`, name: `Up 1/8"` },
                    { id: `None`, name: `None` },
                    { id: `Down 1/8"`, name: `Down 1/8"` },
                    { id: `Down 3/16"`, name: `Down 3/16"` },
                    { id: `Down 1/4"`, name: `Down 1/4"` },
                  ]}
                  error={errors.card_2?.message}
                  className="flex-1"
                />
              )}
            />
            <Controller
              name="card_3"
              control={control}
              rules={{ required: "Card Type is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="card_3"
                  label="Card 3"
                  placeholder="Card Type here"
                  options={[
                    { id: `Up 1/4"`, name: `Up 1/4"` },
                    { id: `Up 3/16"`, name: `Up 3/16"` },
                    { id: `Up 1/8"`, name: `Up 1/8"` },
                    { id: `None`, name: `None` },
                    { id: `Down 1/8"`, name: `Down 1/8"` },
                    { id: `Down 3/16"`, name: `Down 3/16"` },
                    { id: `Down 1/4"`, name: `Down 1/4"` },
                  ]}
                  error={errors.card_3?.message}
                  className="flex-1"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 my-6">
            <p className="font-semibold text-[15px] text-gray-700 dark:text-gray">
              Options
            </p>
            <label className="flex items-center gap-2 text-sm dark:text-gray cursor-pointer w-fit">
              <input
                {...register("is_default")}
                type="checkbox"
                className="accent-brown"
              />
              This is the default card printing profile
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-4 lg:mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-brown dark:bg-dark-brown hover:bg-brown text-white px-8 cursor-pointer"
            >
              {isPending ? "Updating..." : "Update Settings"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default Page;
