"use client";

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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = ({ params }) => {
  const { id: studentId } = params;

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      billing_same_as_mailing: true,
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

  const { data: studentData, isLoading: studentDataLoading } =
    useGetStudent(studentId);

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

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
        // type: student.type || "",
        code: student.code || "",
        status: student.status || "Pending",
      });
    }
  }, [studentData, countryData, reset]);

  const { mutate, isPending } = useUpdateStudentData();

  const onSubmit = (data) => {
    const payload = {
      student_id: Number(studentId),
      // course_id: studentData?.data?.course_id,

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
      type: data.type || null,
      code: data.code || null,
      status: data.status || "Pending",

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

    mutate(payload, {
      onSuccess: (response) => {
        toast.success(response?.message || "Student updated successfully");
        router.back();
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to update student");
      },
    });
  };

  return (
    <div>
      <SectionTitle title={"Update Student"} />
      <FormContainer form={form} onSubmit={onSubmit} className={"mt-5"}>
        <FormInput
          name="promo_code"
          label="Promo Code:"
          placeholder="Promo Code"
        />

        <h6 className="text-xl font-medium mb-1 mt-3">Student Information</h6>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
          <FormInput
            name="first_name"
            label="First Name"
            placeholder="First Name"
          />
          <FormInput
            name="last_name"
            label="Last Name"
            placeholder="Last Name"
          />
          <FormInput
            name="email"
            label="Email Address"
            placeholder="Email Address"
          />
          <FormInput
            name="confirm_email"
            label="Confirm Email Address"
            placeholder="Confirm Email Address"
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
        </div>

        <h6 className="text-xl font-medium mb-1 mt-3">Mailing Address</h6>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
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

          <label className="flex items-center gap-1 col-span-1 md:col-span-2">
            <input {...register("billing_same_as_mailing")} type="checkbox" />
            Use the above address as my billing address
          </label>
        </div>

        {!isBillingSameAsMailing && (
          <>
            <h6 className="text-xl font-medium mb-1 mt-3">Billing Address</h6>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
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

        {/* Optional / additional fields — show if you want admin to edit them */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
          <FormInput name="score" label="Score" placeholder="e.g. 95" />
          {/* <FormInput name="type" label="Type" placeholder="e.g. 1" /> */}
          <FormInput
            name="code"
            label="Student Code"
            placeholder="e.g. STU-99"
          />
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register("status")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
              {/* <option value="Cancelled">Cancelled</option> */}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-5 lg:mt-10">
          <Button
            onClick={() => router.back()}
            type="button"
            className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown  focus:outline-none"
          >
            {isPending ? "Updating..." : "Update Student"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default Page;
