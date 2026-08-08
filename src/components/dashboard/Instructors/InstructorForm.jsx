// src/components/dashboard/Instructors/InstructorForm.jsx
"use client";

import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  createInstructor,
  updateInstructor,
  getAllCountry,
  getallTrainingsite,
  getSingleInstructor,
} from "@/hooks/api/dashboardApi";
import { LucideTrash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";

const INSTRUCTOR_ROLE_ID = 3;

const DEFAULT_VALUES = {
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
  trainingSites: [{ tsite_id: "" }],
};

const InstructorForm = ({ mode = "add", instructorId }) => {
  const router = useRouter();
  const isEdit = mode === "edit";

  const defaultValues = useMemo(() => DEFAULT_VALUES, []);
  const form = useForm({ defaultValues });

  const {
    control,
    reset,
    watch,
    formState: { errors },
  } = form;

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();
  const { data: trainingSiteData, isLoading: trainingSiteLoading } =
    getallTrainingsite({ type: "all" });
  const { data: instructorData, isLoading: instructorLoading } =
    getSingleInstructor(isEdit ? instructorId : undefined);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "trainingSites",
  });

  const { mutate: storeInstructorMutation, isPending: storeInstructorPending } =
    createInstructor();
  const { mutate: editInstructorMutation, isPending: editInstructorPending } =
    updateInstructor(instructorId);

  const isPending = isEdit ? editInstructorPending : storeInstructorPending;

  useEffect(() => {
    if (!isEdit) return;
    if (instructorData?.data && countryData?.data && trainingSiteData?.data) {
      const d = instructorData.data;

      const trainingSites =
        d?.site_roles?.length > 0
          ? d.site_roles.map(sr => ({ tsite_id: sr.training_site_id }))
          : d?.training_site_id
            ? [{ tsite_id: d.training_site_id }]
            : [{ tsite_id: "" }];

      reset({
        ...DEFAULT_VALUES,
        firstName: d?.first_name ?? "",
        lastName: d?.last_name ?? "",
        username: d?.username ?? "",
        mobilePhone: d?.mobile_phone ?? "",
        address1: d?.address_line_1 ?? "",
        address2: d?.address_line_2 ?? "",
        city: d?.city ?? "",
        stateProvince: d?.state_province_region ?? "",
        zipPostalCode: d?.zip_postal_code ?? "",
        country: d?.country_id ?? "",
        printName: d?.name_to_print_on_card ?? "",
        ahaInstructorId: d?.aha_instructor_id ?? "",
        hsiInstructorId: d?.hsi_instructor_id ?? "",
        rclcUsername: d?.rclc_username ?? "",
        emailAddress: d?.email ?? "",
        password: "",
        trainingSites,
      });
    }
  }, [isEdit, instructorData, countryData, trainingSiteData, reset]);

  const watchedSites = watch("trainingSites");
  const selectedSiteIds = (watchedSites || [])
    .map(ts => ts.tsite_id)
    .filter(Boolean);

  const onSubmit = values => {
    const siteIds = values.trainingSites.map(ts => ts.tsite_id);
    const hasDupes = siteIds.length !== new Set(siteIds).size;

    if (hasDupes) {
      toast.error("Duplicate training sites found. Please remove duplicates.");
      return;
    }

    const payload = {
      username: values.username,
      first_name: values.firstName,
      last_name: values.lastName,
      address_line_1: values.address1,
      address_line_2: values.address2,
      city: values.city,
      state_province_region: values.stateProvince,
      zip_postal_code: values.zipPostalCode,
      country_id: values.country,
      mobile_phone: values.mobilePhone,
      name_to_print_on_card: values.printName,
      aha_instructor_id: values.ahaInstructorId,
      hsi_instructor_id: values.hsiInstructorId,
      rclc_username: values.rclcUsername,
      email: values.emailAddress,
      site_roles: values.trainingSites.map(ts => ({
        training_site_id: Number(ts.tsite_id),
        role_id: INSTRUCTOR_ROLE_ID,
      })),
    };

    if (!isEdit || values.password) {
      payload.password = values.password;
    }

    const mutate = isEdit ? editInstructorMutation : storeInstructorMutation;

    mutate(
      { data: payload },
      {
        onSuccess: data => {
          if (data?.status !== false) {
            toast.success(
              data?.message ||
                (isEdit
                  ? "Instructor updated successfully!"
                  : "Instructor added successfully!"),
            );
            router.back();
          }
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  if (
    isEdit &&
    (instructorLoading || countryDataLoading || trainingSiteLoading)
  ) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="Edit Instructor" />
        <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-brown dark:border-t-dark-brown rounded-full animate-spin" />
            <span className="text-sm">Loading instructor data…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title={isEdit ? "Edit Instructor" : "Add New Instructor"} />
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
                  className="flex-1"
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
              placeholder="Password"
              type="password"
              rules={
                isEdit
                  ? { minLength: { value: 8, message: "Minimum 8 characters" } }
                  : {
                      required: "Password is required",
                      minLength: { value: 8, message: "Minimum 8 characters" },
                    }
              }
            />

            {/* Training Sites */}
            <div className="col-span-1 bg-neutral-50 dark:bg-dark border dark:border-gray-700 px-2 pt-2 pb-4 rounded-md">
              <h6 className="text-lg mb-1 text-black dark:text-gray">
                Training Sites
              </h6>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Instructor role will be assigned to each selected site.
              </p>

              {fields.map((field, index) => {
                const currentVal = watchedSites?.[index]?.tsite_id;
                const isDuplicate =
                  currentVal &&
                  selectedSiteIds.filter(
                    id => String(id) === String(currentVal),
                  ).length > 1;

                return (
                  <div
                    key={field.id}
                    className="mt-3 border-b dark:border-gray-700 pb-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Controller
                          name={`trainingSites.${index}.tsite_id`}
                          control={control}
                          rules={{ required: "Training site is required" }}
                          render={({ field }) => (
                            <CustomSelect
                              {...field}
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
                      </div>

                      {fields.length > 1 && (
                        <div
                          onClick={() => remove(index)}
                          className="bg-neutral-200 dark:bg-gray-700 p-2 rounded-md cursor-pointer hover:bg-neutral-300 dark:hover:bg-gray-600 shrink-0"
                        >
                          <LucideTrash2 className="size-4 text-gray-700 dark:text-gray" />
                        </div>
                      )}
                    </div>

                    {isDuplicate && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        This training site is already selected.
                      </p>
                    )}
                  </div>
                );
              })}

              <div
                onClick={() => append({ tsite_id: "" })}
                className="mt-4 px-2 py-1.5 inline-flex items-center gap-1 border dark:border-gray-600 rounded-md text-sm bg-neutral-700 dark:bg-gray-800 text-neutral-100 cursor-pointer hover:bg-neutral-600 dark:hover:bg-gray-700 shadow-sm"
              >
                <FaPlus className="size-3" />
                Add more
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mt-8 gap-4">
            <BackButton />
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Add Instructor"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default InstructorForm;
