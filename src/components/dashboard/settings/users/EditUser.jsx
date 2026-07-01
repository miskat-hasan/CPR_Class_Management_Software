// src/components/dashboard/settings/users/EditUser.jsx
"use client";

import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import MultiSelect from "@/components/shared/form/MultiSelect";
import { Button } from "@/components/ui/button";
import {
  getAllCountry,
  getAllRole,
  getallTrainingsite,
  useGetSingleUser,
  useUpdateUser,
} from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { LucideTrash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";

const ASSIGNABLE_ROLES = {
  "Super Admin": [
    "Admin",
    "Instructor",
    "Instructor Assistant",
    "Student",
    "Client",
  ],
  Admin: ["Instructor", "Instructor Assistant", "Student", "Client"],
  Instructor: ["Instructor Assistant", "Student", "Client"],
  "Instructor Assistant": ["Student", "Client"],
  Student: [],
  Client: [],
};

const EditUser = () => {
  const router = useRouter();
  const { ts, id } = useParams();
  const isPrimarySite = String(ts) === "1";
  const { activeRole } = useAuth();
  const authRoleName = activeRole?.role_name;

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      mobilePhone: "",
      address1: "",
      address2: "",
      city: "",
      stateProvince: "",
      zipPostalCode: "",
      country: "",
      printName: "",
      ahaInstructorId: "",
      hsiInstructorId: "",
      rclcUsername: "",
      emailAddress: "",
      password: "",
      trainingSites: [{ tsite_id: "", role_id: "" }],
      roleIds: [],
    },
  });

  const {
    control,
    formState: { errors },
    watch,
    reset,
  } = form;
  const watchedSites = watch("trainingSites");

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();
  const { data: trainingSiteData, isLoading: trainingSiteLoading } =
    getallTrainingsite();
  const { data: rolesData, isLoading: rolesLoading } = getAllRole();
  const { data: userData, isLoading: userLoading } = useGetSingleUser(id);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "trainingSites",
  });
  const { mutate: updateUserMutation, isPending: updateUserPending } =
    useUpdateUser(id);

  const primarySiteRoles = useMemo(
    () => (rolesData?.data ?? []).filter(r => r.name !== "Super Admin"),
    [rolesData],
  );

  const otherSiteRoles = useMemo(() => {
    const assignable = ASSIGNABLE_ROLES[authRoleName] ?? [];
    return (rolesData?.data ?? []).filter(r => assignable.includes(r.name));
  }, [rolesData, authRoleName]);

  // Pre-populate form — user fields live under data.instructor, roles under data.user_roles
  useEffect(() => {
    const raw = userData?.data;
    if (!raw) return;

    // Actual profile fields are under `.instructor`
    const user = raw.instructor ?? raw;

    const siteRoles =
      raw.user_roles?.length > 0
        ? raw.user_roles.map(ur => ({
            tsite_id: String(
              ur?.training_site_id ?? ur?.training_site?.id ?? "",
            ),
            role_id: String(ur?.role_id ?? ur?.role?.id ?? ""),
          }))
        : [{ tsite_id: "", role_id: "" }];

    const existingRoleIds = (raw.user_roles ?? []).map(ur =>
      String(ur?.role_id ?? ur?.role?.id ?? ""),
    );

    reset({
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      username: user.username ?? "",
      mobilePhone: user.mobile_phone ?? "",
      address1: user.address_line_1 ?? "",
      address2: user.address_line_2 ?? "",
      city: user.city ?? "",
      stateProvince: user.state_province_region ?? "",
      zipPostalCode: user.zip_postal_code ?? "",
      country: String(user.country_id ?? ""),
      printName: user.name_to_print_on_card ?? "",
      ahaInstructorId: user.aha_instructor_id ?? "",
      hsiInstructorId: user.hsi_instructor_id ?? "",
      rclcUsername: user.rclc_username ?? "",
      emailAddress: user.email ?? "",
      password: "",
      trainingSites: siteRoles,
      roleIds: existingRoleIds,
    });
  }, [userData, reset]);

  const isDuplicate = (currentIndex, tsiteId, roleId) => {
    if (!tsiteId || !roleId) return false;
    return watchedSites.some(
      (row, i) =>
        i !== currentIndex &&
        String(row.tsite_id) === String(tsiteId) &&
        String(row.role_id) === String(roleId),
    );
  };

  const onSubmit = values => {
    if (isPrimarySite) {
      const combos = values.trainingSites.map(
        ts => `${ts.tsite_id}-${ts.role_id}`,
      );
      if (combos.length !== new Set(combos).size) {
        toast.error(
          "Duplicate training site and role combination found. Please fix before submitting.",
        );
        return;
      }
    }

    const base = {
      id: Number(id),
      first_name: values.firstName,
      last_name: values.lastName,
      username: values.username,
      mobile_phone: values.mobilePhone,
      address_line_1: values.address1,
      address_line_2: values.address2,
      city: values.city,
      state_province_region: values.stateProvince,
      zip_postal_code: values.zipPostalCode,
      country_id: values.country,
      name_to_print_on_card: values.printName,
      aha_instructor_id: values.ahaInstructorId,
      hsi_instructor_id: values.hsiInstructorId,
      rclc_username: values.rclcUsername,
      email: values.emailAddress,
      active_user: true,
    };

    if (values.password) base.password = values.password;

    const payload = isPrimarySite
      ? {
          ...base,
          site_roles: values.trainingSites.map(ts => ({
            training_site_id: Number(ts.tsite_id),
            role_id: Number(ts.role_id),
          })),
        }
      : {
          ...base,
          role_ids: (Array.isArray(values.roleIds)
            ? values.roleIds
            : [values.roleIds]
          ).map(Number),
        };

    updateUserMutation(
      { data: payload },
      {
        onSuccess: data => {
          if (data?.status) {
            toast.success(data?.message || "User updated successfully!");
            router.back();
          }
        },
        
      },
    );
  };

  if (userLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="Edit User" />
        <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-brown rounded-full animate-spin" />
            <span className="text-sm">Loading user data…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Edit User" />
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px]">
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              name="firstName"
              label="First Name"
              placeholder="First name"
              rules={{ required: "First name is required" }}
            />
            <FormInput
              name="lastName"
              label="Last Name"
              placeholder="Last name"
              rules={{ required: "Last name is required" }}
            />
            <FormInput
              name="username"
              label="Username"
              placeholder="Username"
              rules={{ required: "Username is required" }}
            />
            <FormInput
              name="mobilePhone"
              label="Mobile Phone"
              placeholder="Mobile phone"
              rules={{ required: "Mobile phone is required" }}
            />
            <FormInput
              name="address1"
              label="Address 1"
              placeholder="Address line 1"
            />
            <FormInput
              name="address2"
              label="Address 2"
              placeholder="Address line 2"
            />
            <FormInput name="city" label="City" placeholder="City" />
            <FormInput
              name="stateProvince"
              label="State / Province / Region"
              placeholder="State/Province"
            />
            <FormInput
              name="zipPostalCode"
              label="Zip / Postal Code"
              placeholder="Zip/Postal code"
            />

            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="Country"
                  placeholder="Select country"
                  isLoading={countryDataLoading}
                  options={countryData?.data ?? []}
                  error={errors.country?.message}
                />
              )}
            />

            <FormInput
              name="printName"
              label="Name To Print On Card (Optional)"
              placeholder="Name on card"
            />
            <FormInput
              name="ahaInstructorId"
              label="AHA Instructor ID (Optional)"
              placeholder="AHA ID"
            />
            <FormInput
              name="hsiInstructorId"
              label="HSI (ASHI) Instructor ID (Optional)"
              placeholder="HSI ID"
            />
            <FormInput
              name="rclcUsername"
              label="RCLC Username (Optional)"
              placeholder="RCLC username"
            />

            <FormInput
              name="emailAddress"
              label="Email Address"
              placeholder="Email address"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
            />
            <FormInput
              name="password"
              label="Password (leave blank to keep current)"
              placeholder="New password"
              type="password"
              rules={{
                minLength: { value: 8, message: "Minimum 8 characters" },
              }}
            />

            {/* Training Site & Roles */}
            <div className="col-span-1 md:col-span-2 bg-neutral-50 dark:bg-dark border dark:border-gray-700 px-3 pt-3 pb-4 rounded-md">
              <h6 className="text-base font-semibold mb-2 dark:text-gray">
                Training Site and Roles
              </h6>

              {isPrimarySite ? (
                <>
                  {fields.map((field, index) => {
                    const currentRow = watchedSites[index];
                    const duplicate = isDuplicate(
                      index,
                      currentRow?.tsite_id,
                      currentRow?.role_id,
                    );
                    return (
                      <div
                        key={field.id}
                        className="mt-3 border-b dark:border-gray-700 pb-3"
                      >
                        <div className="flex items-end gap-3">
                          <div className="grid sm:grid-cols-2 gap-4 flex-1">
                            <Controller
                              name={`trainingSites.${index}.tsite_id`}
                              control={control}
                              rules={{ required: "Training site is required" }}
                              render={({ field }) => (
                                <CustomSelect
                                  {...field}
                                  label="Training Site"
                                  placeholder="Select site"
                                  isLoading={trainingSiteLoading}
                                  options={trainingSiteData?.data ?? []}
                                  error={
                                    errors?.trainingSites?.[index]?.tsite_id
                                      ?.message
                                  }
                                />
                              )}
                            />
                            <Controller
                              name={`trainingSites.${index}.role_id`}
                              control={control}
                              rules={{ required: "Role is required" }}
                              render={({ field }) => (
                                <CustomSelect
                                  {...field}
                                  label="Role"
                                  placeholder="Select role"
                                  isLoading={rolesLoading}
                                  options={primarySiteRoles}
                                  error={
                                    errors?.trainingSites?.[index]?.role_id
                                      ?.message
                                  }
                                />
                              )}
                            />
                          </div>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 bg-neutral-200 dark:bg-gray-700 rounded-md hover:bg-red-100 transition cursor-pointer mb-0.5"
                            >
                              <LucideTrash2 className="size-4 text-gray-600 dark:text-gray" />
                            </button>
                          )}
                        </div>
                        {duplicate && (
                          <p className="text-xs text-red-500 mt-1.5">
                            This training site and role combination is already
                            added.
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => append({ tsite_id: "", role_id: "" })}
                    className="mt-3 px-3 py-1.5 inline-flex items-center gap-1.5 border rounded-md text-sm bg-neutral-700 dark:bg-gray-800 text-neutral-100 cursor-pointer hover:bg-neutral-600 w-fit"
                  >
                    <FaPlus className="size-3" /> Add more
                  </button>
                </>
              ) : (
                <div className="mt-3">
                  <Controller
                    name="roleIds"
                    control={control}
                    rules={{ required: "At least one role is required" }}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        label="Roles"
                        placeholder="Select one or more roles"
                        isLoading={rolesLoading}
                        options={otherSiteRoles}
                        error={errors?.roleIds?.message}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    These roles will be assigned to training site #{ts}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end mt-6 gap-3">
            <BackButton />
            <Button
              type="submit"
              disabled={updateUserPending}
              className="px-6 py-2 text-sm font-medium text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateUserPending ? "Saving..." : "Update User"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default EditUser;
