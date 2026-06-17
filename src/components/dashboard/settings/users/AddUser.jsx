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
  useStoreUser,
} from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { LucideTrash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
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

const AddUser = () => {
  const router = useRouter();
  const { ts } = useParams();
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
  } = form;

  // Watch all trainingSites rows to detect duplicates live
  const watchedSites = watch("trainingSites");

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();
  const { data: trainingSiteData, isLoading: trainingSiteLoading } =
    getallTrainingsite();
  const { data: rolesData, isLoading: rolesLoading } = getAllRole();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "trainingSites",
  });

  const { mutate: storeUserMutation, isPending: storeUserPending } =
    useStoreUser();

  // Roles for primary site — exclude Super Admin
  const primarySiteRoles = useMemo(() => {
    return (rolesData?.data ?? []).filter((r) => r.name !== "Super Admin");
  }, [rolesData]);

  // Roles for other sites — filtered by auth user's role
  const otherSiteRoles = useMemo(() => {
    const assignable = ASSIGNABLE_ROLES[authRoleName] ?? [];
    return (rolesData?.data ?? []).filter((r) => assignable.includes(r.name));
  }, [rolesData, authRoleName]);

  // Check if a site+role combo is already used in another row
  const isDuplicate = (currentIndex, tsiteId, roleId) => {
    if (!tsiteId || !roleId) return false;
    return watchedSites.some(
      (row, i) =>
        i !== currentIndex &&
        String(row.tsite_id) === String(tsiteId) &&
        String(row.role_id) === String(roleId),
    );
  };

  const onSubmit = (values) => {
    // Extra duplicate check before submit
    if (isPrimarySite) {
      const combos = values.trainingSites.map(
        (ts) => `${ts.tsite_id}-${ts.role_id}`,
      );
      const hasDuplicates = combos.length !== new Set(combos).size;
      if (hasDuplicates) {
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
      password: values.password,
      active_user: true,
    };

    const payload = isPrimarySite
      ? {
          ...base,
          site_roles: values.trainingSites.map((ts) => ({
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

    storeUserMutation(
      { data: payload },
      {
        onSuccess: (data) => {
          if (data?.status) {
            toast.success(data?.message || "User added successfully!");
            router.back();
          }
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title={"Add User"} />
      <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-6">
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
              label="State/Province/Region"
              placeholder="State/Province"
            />
            <FormInput
              name="zipPostalCode"
              label="Zip/Postal Code"
              placeholder="Zip/Postal code"
            />

            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="country"
                  label="Country"
                  placeholder="Select country"
                  isLoading={countryDataLoading}
                  options={countryData?.data}
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
              label="Password"
              placeholder="Password"
              type="password"
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              }}
            />

            {/* Training Site and Roles */}
            <div className="col-span-2 bg-neutral-50 border px-2 pt-2 pb-4 rounded-md">
              <h6 className="text-lg mb-1">Training Site and Roles</h6>

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
                      <div key={field.id} className="mt-3 border-b pb-3">
                        <div className="flex items-center gap-4">
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
                                  options={trainingSiteData?.data}
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
                            <div
                              onClick={() => remove(index)}
                              className="bg-neutral-200 p-2 -mb-6 rounded-md cursor-pointer hover:bg-neutral-300"
                            >
                              <LucideTrash2 className="size-4" />
                            </div>
                          )}
                        </div>

                        {/* Duplicate warning shown inline under the row */}
                        {duplicate && (
                          <p className="text-xs text-red-500 mt-1.5">
                            This training site and role combination is already
                            added.
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div
                    onClick={() => append({ tsite_id: "", role_id: "" })}
                    className="mt-4 px-2 py-1.5 inline-flex items-center gap-1 border rounded-md text-sm bg-neutral-700 text-neutral-100 cursor-pointer hover:bg-neutral-600 shadow-sm"
                  >
                    <FaPlus className="size-3" />
                    Add more
                  </div>
                </>
              ) : (
                // OTHER SITES — multi-select roles
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
                  <p className="text-xs text-gray-500 mt-1">
                    These roles will be assigned to training site #{ts}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end mt-8 gap-4">
            <BackButton />
            <Button
              type="submit"
              disabled={storeUserPending}
              className="px-6 py-2 bg-[#C1121F] text-white rounded-md text-sm font-medium hover:bg-[#a00e1a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {storeUserPending ? "Saving..." : "Add User"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default AddUser;
