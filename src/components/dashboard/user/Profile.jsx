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
  useGetSingleUser,
  useUpdateAuthUser,
} from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

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
  const { user } = useAuth();

  const { data, isLoading } = useGetSingleUser(user?.id);
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

  const profileDefaults = useMemo(() => {
    const u = data?.data?.instructor;
    if (!u) return null;
    return {
      username: u.username ?? "",
      first_name: u.first_name ?? "",
      last_name: u.last_name ?? "",
      email: u.email ?? "",
      mobile_phone: u.mobile_phone ?? "",
      address_line_1: u.address_line_1 ?? "",
      address_line_2: u.address_line_2 ?? "",
      city: u.city ?? "",
      state_province_region: u.state_province_region ?? "",
      zip_postal_code: u.zip_postal_code ?? "",
      country_id: u.country_id ?? "",
      name_to_print_on_card: u.name_to_print_on_card ?? "",
      aha_instructor_id: u.aha_instructor_id ?? "",
      hsi_instructor_id: u.hsi_instructor_id ?? "",
      rclc_username: u.rclc_username ?? "",
    };
  }, [data]);

  useEffect(() => {
    if (profileDefaults) profileReset(profileDefaults);
  }, [profileDefaults, profileReset]);

  const { mutate: updateMutation, isPending: updatePending } =
    useUpdateAuthUser(user?.id);

  const onProfileSubmit = formData => {
    updateMutation(formData, {
      onSuccess: res =>
        toast.success(res?.message || "Profile updated successfully"),
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
  if (isLoading || countryLoading) {
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
      <SectionTitle title="My Account" />

      {/* ── 1. General Information ── */}
      <SectionCard title="1. General Information">
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
                name="name_to_print_on_card"
                label="Name to Print on Card"
                error={errors.name_to_print_on_card?.message}
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

              {/* Certifying body IDs */}
              {user?.role == "instructor" && (
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

      {/* ── 2. Password Change ── */}
      <SectionCard title="2. Password Change">
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
