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
  useStoreUser,
  useUpdateUser,
} from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { LucideTrash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { useDefaultCountry } from "@/hooks/useDefaultCountry";
import UserDocumentsSection from "../documents/UserDocumentsSection";

const ASSIGNABLE_ROLES = {
  "Super Admin": ["Admin", "Instructor", "Instructor Assistant"],
  "Site Coordinator": ["Admin", "Instructor", "Instructor Assistant"],
  Admin: ["Admin", "Instructor", "Instructor Assistant"],
};

const COORDINATOR_ROLE_NAME = "Site Coordinator";

const UserForm = ({ mode, id }) => {
  const isEdit = mode === "edit";
  const router = useRouter();
  const { activeRole, selectedTrainingSiteId } = useAuth();
  const isPrimarySite = String(selectedTrainingSiteId) === "1";
  const authRoleName = activeRole?.role_name;

  const canEditTrainingSites = isEdit
    ? isPrimarySite && authRoleName === "Super Admin"
    : isPrimarySite;

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

  useDefaultCountry({
    form,
    countryData,
    countryLoading: countryDataLoading,
    fieldName: "country",
  });
  const { data: trainingSiteData, isLoading: trainingSiteLoading } =
    getallTrainingsite({ type: "all" });
  const { data: rolesData, isLoading: rolesLoading } = getAllRole();
  const { data: userData, isLoading: userLoading } = useGetSingleUser(
    isEdit ? id : null,
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "trainingSites",
  });

  const { mutate: storeUserMutation, isPending: storeUserPending } =
    useStoreUser();
  const { mutate: updateUserMutation, isPending: updateUserPending } =
    useUpdateUser(id);
  const isSaving = isEdit ? updateUserPending : storeUserPending;

  const primarySiteRoles = useMemo(
    () =>
      (rolesData?.data ?? []).filter(
        r =>
          r.name !== "Super Admin" &&
          r.name !== "Client" &&
          r.name !== "Student" &&
          r.name !== COORDINATOR_ROLE_NAME,
      ),
    [rolesData],
  );

  const otherSiteRoles = useMemo(() => {
    const assignable = ASSIGNABLE_ROLES[authRoleName] ?? [];
    return (rolesData?.data ?? []).filter(r => assignable.includes(r.name));
  }, [rolesData, authRoleName]);

  const roleNameById = useMemo(() => {
    const map = new Map();
    (rolesData?.data ?? []).forEach(r => map.set(String(r.id), r.name));
    return map;
  }, [rolesData]);

  const coordinatorRoleId = useMemo(() => {
    const role = (rolesData?.data ?? []).find(
      r => r.name === COORDINATOR_ROLE_NAME,
    );
    return role ? Number(role.id) : null;
  }, [rolesData]);

  const trainingSiteNameById = useMemo(() => {
    const map = new Map();
    (trainingSiteData?.data ?? []).forEach(site => {
      map.set(String(site.id ?? site.value), site.name ?? site.label);
    });
    return map;
  }, [trainingSiteData]);

  const [coordinatorAssignment, setCoordinatorAssignment] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    const raw = userData?.data;
    if (!raw) return;

    const user = raw?.user_details ?? raw;
    const userRoles = raw.user_roles ?? [];

    const coordinatorRow = userRoles.find(ur => {
      const roleName =
        ur?.role?.name ??
        roleNameById.get(String(ur?.role_id ?? ur?.role?.id ?? ""));
      return roleName === COORDINATOR_ROLE_NAME;
    });
    const editableRows = userRoles.filter(ur => ur !== coordinatorRow);

    setCoordinatorAssignment(
      coordinatorRow
        ? {
            tsiteId: String(
              coordinatorRow?.training_site_id ??
                coordinatorRow?.training_site?.id ??
                "",
            ),
            siteName:
              coordinatorRow?.training_site?.training_center_name ??
              trainingSiteNameById.get(
                String(
                  coordinatorRow?.training_site_id ??
                    coordinatorRow?.training_site?.id ??
                    "",
                ),
              ) ??
              "—",
          }
        : null,
    );

    const siteRoles =
      editableRows.length > 0
        ? editableRows.map(ur => ({
            tsite_id: String(
              ur?.training_site_id ?? ur?.training_site?.id ?? "",
            ),
            role_id: String(ur?.role_id ?? ur?.role?.id ?? ""),
          }))
        : [{ tsite_id: "", role_id: "" }];

    const existingRoleIds = userRoles.map(ur =>
      String(ur?.role_id ?? ur?.role?.id ?? ""),
    );

    reset({
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      username: raw.username ?? "",
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
      emailAddress: raw.email ?? "",
      password: "",
      trainingSites: siteRoles,
      roleIds: existingRoleIds,
    });
  }, [isEdit, userData, reset, roleNameById, trainingSiteNameById]);

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
    if (canEditTrainingSites) {
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

    if (isEdit) {
      base.id = Number(id);
      if (values.password) base.password = values.password;
    } else {
      base.password = values.password;
    }

    const editableSiteRoles = values.trainingSites.map(ts => ({
      training_site_id: Number(ts.tsite_id),
      role_id: Number(ts.role_id),
    }));

    // Re-include the user's existing coordinator assignment — it's fixed
    // in this UI, so it must be sent back or the backend would drop it.
    const coordinatorSiteRole =
      isEdit && coordinatorAssignment && coordinatorRoleId
        ? [
            {
              training_site_id: Number(coordinatorAssignment.tsiteId),
              role_id: coordinatorRoleId,
            },
          ]
        : [];

    const payload = canEditTrainingSites
      ? {
          ...base,
          site_roles: [...coordinatorSiteRole, ...editableSiteRoles],
        }
      : {
          ...base,
          role_ids: (Array.isArray(values.roleIds)
            ? values.roleIds
            : [values.roleIds]
          ).map(Number),
        };

    const mutate = isEdit ? updateUserMutation : storeUserMutation;

    mutate(
      { data: payload },
      {
        onSuccess: data => {
          if (data?.status) {
            toast.success(
              data?.message ||
                (isEdit
                  ? "User updated successfully!"
                  : "User added successfully!"),
            );
            router.back();
          }
        },
        onError: err =>
          toast.error(
            err?.response?.data?.message ||
              `Failed to ${isEdit ? "update" : "add"} user.`,
          ),
      },
    );
  };

  if (isEdit && userLoading) {
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
      <SectionTitle title={isEdit ? "Edit User" : "Add User"} />
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
              label={
                isEdit ? "Password (leave blank to keep current)" : "Password"
              }
              placeholder={isEdit ? "New password" : "Password"}
              type="password"
              rules={{
                required: isEdit ? false : "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              }}
            />

            {/* Training Site & Roles */}
            <div className="col-span-1 md:col-span-2 bg-neutral-50 dark:bg-dark border dark:border-gray-700 px-3 pt-3 pb-4 rounded-md">
              <h6 className="text-base font-semibold mb-2 dark:text-gray">
                Training Site and Roles
              </h6>

              {coordinatorAssignment && (
                <div className="mt-3 mb-4 flex items-center justify-between bg-neutral-100 dark:bg-gray-800 rounded-md px-3 py-2.5">
                  <span className="text-sm text-neutral-700 dark:text-gray">
                    {coordinatorAssignment.siteName}
                  </span>
                  <span className="text-xs font-medium text-red-500">
                    Site Coordinator
                  </span>
                </div>
              )}

              {canEditTrainingSites ? (
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
                    These roles will be assigned to this training site
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end mt-6 gap-3">
            <BackButton />
            <Button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : isEdit ? "Update User" : "Add User"}
            </Button>
          </div>
        </FormContainer>
      </div>
      {isEdit && <UserDocumentsSection userId={id} title={"User Documents"}/>}
    </section>
  );
};

export default UserForm;
