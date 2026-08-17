// src/components/dashboard/class-and-students/EditStudent.jsx
"use client";

import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  getAllCountry,
  useGetStudent,
  useUpdateStudentData,
} from "@/hooks/api/dashboardApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDefaultCountry } from "@/hooks/useDefaultCountry";

const STATUS_OPTIONS = [
  { id: "Pending", name: "Pending" },
  { id: "Complete", name: "Completed" },
  { id: "Incomplete", name: "Incomplete" },
  { id: "Remediate", name: "Remediate" },
  { id: "No Show", name: "No Show" },
  { id: "Waitlisted", name: "Waitlisted" },
];

const EditStudentPage = () => {
  const { id: studentId } = useParams();

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      billing_same_as_mailing: true,
      username: "",
      password: "",
    },
  });

  const {
    control,
    watch,
    reset,
    register,
    formState: { errors },
  } = form;

  const isBillingSameAsMailing = watch("billing_same_as_mailing");
  const emailValue = watch("email");

  const { data: studentData, isLoading: studentDataLoading } =
    useGetStudent(studentId);

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  useDefaultCountry({
    form,
    countryData,
    countryLoading: countryDataLoading,
    fieldName: "country_id",
  });

  useEffect(() => {
    if (studentData?.data && countryData?.data) {
      const student = studentData.data;

      reset({
        // core student info
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        email: student.email || "",
        confirm_email: student.confirm_email || student.email || "",
        primary_phone: student.primary_phone || "",
        alternate_phone: student.alternate_phone || "",
        username: student.username || "",
        password: "",

        // mailing address
        address_1: student.address_1 || "",
        address_2: student.address_2 || "",
        city: student.city || "",
        state: student.state || "",
        zip: student.zip || "",
        country_id: student.country_id || null,

        // billing same?
        billing_same_as_mailing:
          student.billing_same_as_mailing === 1 ||
          student.billing_same_as_mailing === true,

        // billing address (only if different)
        mailing_address_1: student.mailing_address_1 || "",
        mailing_address_2: student.mailing_address_2 || "",
        mailing_city: student.mailing_city || "",
        mailing_state: student.mailing_state || "",
        mailing_zip: student.mailing_zip || "",

        // other fields from update payload
        promo_code: student.promo_code || "",
        score: student.score || "",
        code: student.code || "",
        status: student.status || "Pending",
      });
    }
  }, [studentData, countryData, reset]);

  const { mutate, isPending } = useUpdateStudentData();

  const onSubmit = data => {
    const payload = {
      student_id: Number(studentId),
      class_details_id: studentData?.data?.class_details_id || null,

      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      confirm_email: data.confirm_email,
      primary_phone: data.primary_phone,
      address_1: data.address_1,
      address_2: data.address_2 || null,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country_id: Number(data.country_id),

      promo_code: data.promo_code || null,
      score: data.score || null,
      code: data.code || null,
      status: data.status || "Pending",

      username: data.username,

      billing_same_as_mailing: data.billing_same_as_mailing === true,

      // only send mailing_* if billing is different
      ...(data.billing_same_as_mailing
        ? {}
        : {
            mailing_address_1: data.mailing_address_1 || null,
            mailing_address_2: data.mailing_address_2 || null,
            mailing_city: data.mailing_city || null,
            mailing_state: data.mailing_state || null,
            mailing_zip: data.mailing_zip || null,
          }),
    };

    // Only send a password if the admin actually typed a new one —
    // same pattern as Instructor/Client edit forms.
    if (data.password) {
      payload.password = data.password;
    }

    mutate(payload, {
      onSuccess: response => {
        toast.success(response?.message || "Student updated successfully");
        router.back();
      },
      onError: err => {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update student",
        );
      },
    });
  };

  if (studentDataLoading)
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="Update Student" />
        <div className="p-[26px] bg-white dark:bg-zinc-950 border border-transparent dark:border-zinc-800 rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-zinc-500">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-zinc-700 border-t-brown dark:border-t-dark-brown rounded-full animate-spin" />
            <span className="text-sm">Loading student data…</span>
          </div>
        </div>
      </section>
    );

  return (
    <div>
      <SectionTitle title={"Update Student"} />
      <FormContainer form={form} onSubmit={onSubmit} className={"mt-5"}>
        <FormInput
          name="promo_code"
          label="Promo Code:"
          placeholder="Promo Code"
        />

        <h6 className="text-xl font-medium mb-1 mt-3 text-gray-900 dark:text-zinc-100">
          Student Information
        </h6>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-1 sm:px-2 pt-2 pb-4 rounded-md">
          <FormInput
            name="first_name"
            label="First Name"
            placeholder="First Name"
            rules={{ required: "First name is required" }}
          />
          <FormInput
            name="last_name"
            label="Last Name"
            placeholder="Last Name"
            rules={{ required: "Last name is required" }}
          />
          <FormInput
            name="email"
            label="Email Address"
            placeholder="Email Address"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
          />
          <FormInput
            name="confirm_email"
            label="Confirm Email Address"
            placeholder="Confirm Email Address"
            rules={{
              required: "Please confirm the email",
              validate: value => value === emailValue || "Emails do not match",
            }}
          />
          <FormInput
            name="primary_phone"
            label="Mobile Phone"
            placeholder="Mobile Phone"
          />
          <FormInput
            name="alternate_phone"
            label="Alternate Phone"
            placeholder="Alternate Phone"
          />
          <FormInput
            name="username"
            label="Username"
            placeholder="Username"
            rules={{ required: "Username is required" }}
          />
          <FormInput
            name="password"
            label="Password (leave blank to keep current)"
            placeholder="Password"
            type="password"
            rules={{
              minLength: { value: 8, message: "Minimum 8 characters" },
            }}
          />
        </div>

        <h6 className="text-xl font-medium mb-1 mt-3 text-gray-900 dark:text-zinc-100">
          Mailing Address
        </h6>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-1 sm:px-2 pt-2 pb-4 rounded-md">
          <FormInput
            name="address_1"
            label="Address 1"
            placeholder="Address 1"
          />
          <FormInput
            name="address_2"
            label="Address 2"
            placeholder="Address 2"
          />
          <FormInput name="city" label="City" placeholder="City" />
          <FormInput
            name="state"
            label="State/Province/Region"
            placeholder="State/Province/Region"
          />
          <FormInput
            name="zip"
            label="Zip/Postal Code"
            placeholder="Zip/Postal Code"
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

          <label className="flex items-center gap-2 col-span-1 md:col-span-2 text-sm font-medium text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
            <input
              {...register("billing_same_as_mailing")}
              type="checkbox"
              className="accent-brown dark:accent-dark-brown"
            />
            Use the above address as my billing address
          </label>
        </div>

        {!isBillingSameAsMailing && (
          <>
            <h6 className="text-xl font-medium mb-1 mt-3 text-gray-900 dark:text-zinc-100">
              Billing Address
            </h6>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-1 sm:px-2 pt-2 pb-4 rounded-md">
              <FormInput
                name="mailing_address_1"
                label="Address 1"
                placeholder="Address 1"
              />
              <FormInput
                name="mailing_address_2"
                label="Address 2"
                placeholder="Address 2"
              />
              <FormInput name="mailing_city" label="City" placeholder="City" />
              <FormInput
                name="mailing_state"
                label="State/Province/Region"
                placeholder="State/Province/Region"
              />
              <FormInput
                name="mailing_zip"
                label="Zip/Postal Code"
                placeholder="Zip/Postal Code"
              />
            </div>
          </>
        )}

        <h6 className="text-xl font-medium mb-1 mt-3 text-gray-900 dark:text-zinc-100">
          Status & Scores
        </h6>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-1 sm:px-2 pt-2 pb-4 rounded-md">
          <FormInput name="score" label="Score" placeholder="e.g. 95" />
          <FormInput
            name="code"
            label="Student Code"
            placeholder="e.g. STU-99"
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                id="status"
                label="Status"
                placeholder="Status"
                options={STATUS_OPTIONS}
                error={errors.status?.message}
                className="flex-1"
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-4 mt-5 lg:mt-10">
          <BackButton />
          <Button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:opacity-90 transition focus:outline-none"
          >
            {isPending ? "Updating..." : "Update Student"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default EditStudentPage;
