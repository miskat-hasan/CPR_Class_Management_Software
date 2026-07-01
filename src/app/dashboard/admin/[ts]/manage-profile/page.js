"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  getAllCountry,
  getSingleInstructor,
  useChangePassword,
  useUpdateUserData,
} from "@/hooks/api/dashboardApi";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

const Page = () => {
  const { user } = useAuth();

  const { data, isLoading } = getSingleInstructor(user?.id);

  const {
    data: countryData,
    isLoading: countryDataLoading,
  } = getAllCountry();

  const profileForm = useForm();

  const {
    reset: profileFormReset,
    control,
    formState: { errors },
  } = profileForm;

  useEffect(() => {
    if (data?.data && countryData?.data) {
      const instructor = data.data;

      profileFormReset({
        first_name: instructor.first_name || "",
        last_name: instructor.last_name || "",
        address_line_1: instructor.address_line_1 || "",
        city: instructor.city || "",
        state_province_region: instructor.state_province_region || "",
        zip_postal_code: instructor.zip_postal_code || "",
        country_id: instructor.country_id || "",
        mobile_phone: instructor.mobile_phone || "",
        name_to_print_on_card: instructor.name_to_print_on_card || "",
        aha_instructor_id: instructor.aha_instructor_id || "",
        hsi_instructor_id: instructor.hsi_instructor_id || "",
        rclc_username: instructor.rclc_username || "",
      });
    }
  }, [data, countryData, profileFormReset]);

  const { mutate: updateMutation, isPending: updatePending } =
    useUpdateUserData();

  const onProfileSubmit = (formData) => {
    updateMutation(
      { user_id: user?.id, ...formData },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Profile updated successfully");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  const passwordForm = useForm({
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const { reset } = passwordForm;

  const password = passwordForm.watch("password");

  const { mutate: changePasswordMutation, isPending: changePasswordPending } =
    useChangePassword();

  const onPasswordSubmit = (data) => {
    changePasswordMutation(
      { user_id: user?.id, ...data },
      {
        onSuccess: (data) => {
          reset();
         toast.success(data?.message || "Password updated successfully");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  const SkeletonBox = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
  );

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="My Account" />
      {countryDataLoading ? (
        <section className="flex flex-col gap-4 p-4 lg:p-8">

          <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 space-y-4">
            <SectionTitle title="1. General Information" className="mb-3" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-2" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
            </div>

            <div className="flex justify-end mt-4">
              <SkeletonBox className="h-10 w-32" />
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 space-y-4">
            <SectionTitle title="2. Password Change" className="mb-3" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <SkeletonBox className="h-10 col-span-1" />
              <div className="col-span-full flex justify-end mt-4">
                <SkeletonBox className="h-10 w-32" />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8">
            <SectionTitle title="1. General Information" className="mb-3" />

            <FormContainer form={profileForm} onSubmit={onProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FormInput
                  name="first_name"
                  label="First Name"
                  rules={{ required: "First name is required" }}
                  error={errors.first_name?.message}
                />

                <FormInput
                  name="last_name"
                  label="Last Name"
                  rules={{ required: "Last name is required" }}
                  error={errors.last_name?.message}
                />

                <FormInput
                  name="address_line_1"
                  label="Address"
                  rules={{ required: "Address is required" }}
                  error={errors.address_line_1?.message}
                />

                <FormInput
                  name="city"
                  label="City"
                  rules={{ required: "City is required" }}
                  error={errors.city?.message}
                />

                <FormInput
                  name="state_province_region"
                  label="State / Province / Region"
                  rules={{ required: "State / Region is required" }}
                  error={errors.state_province_region?.message}
                />

                <FormInput
                  name="zip_postal_code"
                  label="Zip / Postal Code"
                  rules={{ required: "Zip code is required" }}
                  error={errors.zip_postal_code?.message}
                />

                <Controller
                  name="country_id"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="country"
                      label="Country"
                      placeholder="Country"
                      isLoading={countryDataLoading}
                      options={countryData?.data}
                      error={errors.country_id?.message}
                      className="flex-1"
                    />
                  )}
                />

                <FormInput
                  name="mobile_phone"
                  label="Mobile Phone"
                  type="tel"
                  rules={{
                    required: "Mobile phone is required",
                    pattern: {
                      value: /^[0-9+()-\s]+$/,
                      message: "Invalid phone number",
                    },
                  }}
                  error={errors.mobile_phone?.message}
                />

                <FormInput
                  name="name_to_print_on_card"
                  label="Name To Print On Card"
                  rules={{ required: "Card name is required" }}
                  error={errors.name_to_print_on_card?.message}
                />

                <FormInput
                  name="aha_instructor_id"
                  label="AHA Instructor ID"
                  error={errors.aha_instructor_id?.message}
                />

                <FormInput
                  name="hsi_instructor_id"
                  label="HSI (ASHI) Instructor ID"
                  error={errors.hsi_instructor_id?.message}
                />

                <FormInput
                  name="rclc_username"
                  label="RCLC Username"
                  rules={{ required: "RCLC username is required" }}
                  error={errors.rclc_username?.message}
                />
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  disabled={updatePending}
                  className="bg-brown dark:bg-dark-brown hover:bg-brown  disabled:opacity-50"
                >
                  {updatePending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </FormContainer>
          </div>
          <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8">
            <SectionTitle title="2. Password Change" className="mb-3" />

            <FormContainer form={passwordForm} onSubmit={onPasswordSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FormInput
                  name="old_password"
                  label="Current Password"
                  type="password"
                  rules={{ required: "Current Password is required" }}
                />
                <FormInput
                  name="password"
                  label="New Password"
                  type="password"
                  rules={{ required: "Password is required" }}
                />

                <FormInput
                  name="password_confirmation"
                  label="Confirm Password"
                  type="password"
                  rules={{
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  }}
                />

                <div className="col-span-full flex justify-end mt-6">
                  <Button
                    disabled={changePasswordPending}
                    type="submit"
                    className="bg-brown dark:bg-dark-brown hover:bg-brown  disabled:opacity-50"
                  >
                    {changePasswordPending ? "Processing..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </FormContainer>
          </div>
        </>
      )}
    </section>
  );
};

export default Page;
