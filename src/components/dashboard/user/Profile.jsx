// src/components/dashboard/user/Profile.jsx
"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  getAllCountry,
  useChangePassword,
  useUpdateAuthUser,
} from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { useDefaultCountry } from "@/hooks/useDefaultCountry";
import UserDocumentsSection from "../settings/documents/UserDocumentsSection";
import Link from "next/link";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md ${className}`}
  />
);

// ─── Section card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, children }) => (
  <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 flex flex-col gap-6">
    <h2 className="text-base font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-3">
      {title}
    </h2>
    {children}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const {
    user,
    isLoading: authLoading,
    activeRole,
    selectedTrainingSiteId,
  } = useAuth();

  const { data: countryData, isLoading: countryLoading } = getAllCountry();
  const countryOptions = countryData?.data ?? [];

  // ── Profile form ──
  const profileForm = useForm({
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      mobile_phone: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state_province_region: "",
      zip_postal_code: "",
      country_id: "",
      name_to_print_on_card: "",
      aha_instructor_id: "",
      hsi_instructor_id: "",
      rclc_username: "",
    },
  });

  const {
    control,
    reset: profileReset,
    formState: { errors },
  } = profileForm;

  useDefaultCountry({
    form: profileForm,
    countryData,
    countryLoading,
    fieldName: "country_id",
  });

  const profileDefaults = useMemo(() => {
    const d = user?.user_details;
    if (!d) return null;

    return {
      username: d.username ?? "",
      first_name: d.first_name ?? "",
      last_name: d.last_name ?? "",
      email: d.email ?? "",
      mobile_phone: d.mobile_phone ?? "",
      address_line_1: d.address_line_1 ?? "",
      address_line_2: d.address_line_2 ?? "",
      city: d.city ?? "",
      state_province_region: d.state_province_region ?? "",
      zip_postal_code: d.zip_postal_code ?? "",
      country_id: d.country_id ?? "",
      name_to_print_on_card: d.name_to_print_on_card ?? "",
      aha_instructor_id: d.aha_instructor_id ?? "",
      hsi_instructor_id: d.hsi_instructor_id ?? "",
      rclc_username: d.rclc_username ?? "",
    };
  }, [user]);

  useEffect(() => {
    if (profileDefaults) profileReset(profileDefaults);
  }, [profileDefaults, profileReset]);

  const { mutate: updateMutation, isPending: updatePending } =
    useUpdateAuthUser(user?.id);

  const onProfileSubmit = formData => {
    updateMutation(formData, {
      onSuccess: res =>
        toast.success(res?.message || "Profile updated successfully"),
      onError: err =>
        toast.error(err?.response?.data?.message || "Something went wrong!"),
    });
  };

  // ── Password form ──
  const passwordForm = useForm({
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const { reset: passwordReset } = passwordForm;
  const newPassword = passwordForm.watch("password");

  const { mutate: changePasswordMutation, isPending: changePasswordPending } =
    useChangePassword();

  const onPasswordSubmit = formData => {
    changePasswordMutation(
      { user_id: user?.id, ...formData },
      {
        onSuccess: res => {
          passwordReset();
          toast.success(res?.message || "Password updated successfully");
        },
        onError: err =>
          toast.error(err?.response?.data?.message || "Something went wrong!"),
      },
    );
  };

  // ── Loading skeleton ──
  if (authLoading || countryLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="My Account" />
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 flex flex-col gap-6">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
              <Skeleton className="h-10 md:col-span-2" />
              <Skeleton className="h-10 md:col-span-2" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 flex flex-col gap-6">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="My Profile" />

      {/* ── 1. General Information ── */}
      <SectionCard title="General Information">
        {activeRole?.role_name === "Instructor" && (
          <div className="flex max-md:flex-col gap-2 font-semibold text-sm text-gray-700 dark:text-gray">
            Direct Schedule Link:
            <Link
              target="_blank"
              href={`/schedule?ts_id=${selectedTrainingSiteId}&instructor_id=${user?.instructor_id}`}
              className="text-brown"
            >
              {typeof window !== "undefined" && window.location.origin}
              /schedule?ts_id={selectedTrainingSiteId}&instructor_id=
              {user?.instructor_id}
            </Link>
          </div>
        )}
        <FormContainer form={profileForm} onSubmit={onProfileSubmit}>
          <div className="flex flex-col gap-6">
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
                name="username"
                label="Username"
                rules={{ required: "Username is required" }}
                error={errors.username?.message}
              />
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                error={errors.email?.message}
              />
              <FormInput
                name="name_to_print_on_card"
                label="Name to Print on Card"
                error={errors.name_to_print_on_card?.message}
              />
              <FormInput
                name="mobile_phone"
                label="Mobile Phone"
                type="tel"
                rules={{
                  pattern: {
                    value: /^[0-9+()\-\s]+$/,
                    message: "Invalid phone number",
                  },
                }}
                error={errors.mobile_phone?.message}
              />

              {/* Address — full width */}
              <div className="md:col-span-2">
                <FormInput
                  name="address_line_1"
                  label="Address Line 1"
                  error={errors.address_line_1?.message}
                />
              </div>
              <div className="md:col-span-2">
                <FormInput
                  name="address_line_2"
                  label="Address Line 2"
                  error={errors.address_line_2?.message}
                />
              </div>

              <FormInput
                name="city"
                label="City"
                error={errors.city?.message}
              />
              <FormInput
                name="state_province_region"
                label="State / Province / Region"
                error={errors.state_province_region?.message}
              />
              <FormInput
                name="zip_postal_code"
                label="Zip / Postal Code"
                error={errors.zip_postal_code?.message}
              />
              <Controller
                name="country_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    label="Country"
                    placeholder="Select country"
                    isLoading={countryLoading}
                    options={countryOptions}
                    error={errors.country_id?.message}
                  />
                )}
              />

              {/* Certifying body IDs — instructor accounts only */}
              {activeRole?.role_name === "Instructor" && (
                <>
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
                    error={errors.rclc_username?.message}
                  />
                </>
              )}
            </div>

            <div className="flex justify-end border-t dark:border-gray-700 pt-4">
              <Button
                type="submit"
                disabled={updatePending}
                className="bg-brown dark:bg-dark-brown hover:bg-brown-hover disabled:opacity-50"
              >
                {updatePending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </SectionCard>

      {/* ── 2. My Certificates ── */}
      {activeRole?.role_name !== "Student" && (
        <UserDocumentsSection userId={user?.id} title={"My Documents"} />
      )}

      {/* ── 3. Password Change ── */}
      <SectionCard title="Password Change">
        <FormContainer form={passwordForm} onSubmit={onPasswordSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2">
                <FormInput
                  name="old_password"
                  label="Current Password"
                  type="password"
                  rules={{ required: "Current password is required" }}
                />
              </div>
              <FormInput
                name="password"
                label="New Password"
                type="password"
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
              />
              <FormInput
                name="password_confirmation"
                label="Confirm New Password"
                type="password"
                rules={{
                  required: "Please confirm your password",
                  validate: value =>
                    value === newPassword || "Passwords do not match",
                }}
              />
            </div>

            <div className="flex justify-end border-t dark:border-gray-700 pt-4">
              <Button
                type="submit"
                disabled={changePasswordPending}
                className="bg-brown dark:bg-dark-brown hover:bg-brown-hover disabled:opacity-50"
              >
                {changePasswordPending ? "Processing..." : "Update Password"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </SectionCard>
    </section>
  );
};

export default ProfilePage;
