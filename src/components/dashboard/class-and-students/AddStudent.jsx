// src/components/dashboard/class-and-students/AddStudent.jsx
"use client";

import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  getAllClient,
  getAllCountry,
  useStoreStudentData,
} from "@/hooks/api/dashboardApi";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDefaultCountry } from "@/hooks/useDefaultCountry";

const AddStudentPage = () => {
  const { id } = useParams();

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      billing_same_as_mailing: true,
      receive_text_messages: false,
      checked_in: false,
      is_finalized: true,
      country_id: "",
      mailing_country: "",
      delivery_method: "",
      username: "",
      password: "",
    },
  });

  const {
    control,
    watch,
    register,
    formState: { errors },
  } = form;

  const isBillingSameAsMailing = watch("billing_same_as_mailing");

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  useDefaultCountry({
    form,
    countryData,
    countryLoading: countryDataLoading,
    fieldName: "country_id",
  });
  const { data: clientData, isLoading: clientDataLoading } = getAllClient();

  const { mutate, isPending } = useStoreStudentData();

  const onSubmit = data => {
    const payload = {
      ...data,
      class_details_id: Number(id),
      // course_id: Number(id),
      client_id: Number(data.client_id),
      country_id: Number(data.country_id),
      mailing_address_1: data.billing_same_as_mailing
        ? "null"
        : data.mailing_address_1,
      mailing_address_2: data.billing_same_as_mailing
        ? "null"
        : data.mailing_address_2,
      mailing_city: data.billing_same_as_mailing ? "null" : data.mailing_city,
      mailing_state: data.billing_same_as_mailing ? "null" : data.mailing_state,
      mailing_zip: data.billing_same_as_mailing ? "null" : data.mailing_zip,
      registration_ip: "127.0.0.1",
    };

    mutate(payload, {
      onSuccess: response => {
        toast.success(response?.message || "Student stored successfully");
        form.reset();
        router.back();
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <div>
      <SectionTitle title={"Add New Student"} />
      <FormContainer form={form} onSubmit={onSubmit} className={"mt-5"}>
        <h6 className="text-xl font-medium mb-1 mt-3 text-gray-900 dark:text-zinc-100">
          Student Information
        </h6>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-1 sm:px-2 pt-2 pb-4 rounded-md">
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
            name="primary_phone"
            label="Mobile Phone"
            placeholder="+880..."
          />
          <FormInput
            name="alternate_phone"
            label="Alternate Phone"
            placeholder="+880..."
          />
          <Controller
            name="client_id"
            control={control}
            rules={{ required: "Client is required" }}
            render={({ field }) => (
              <CustomSelect
                {...field}
                id="client"
                label={"Client"}
                placeholder="Client"
                isLoading={clientDataLoading}
                options={clientData?.data?.data}
                error={errors.client_id?.message}
                className={"flex-1"}
              />
            )}
          />
          <FormInput
            name="username"
            label="Username"
            placeholder="Username"
            rules={{ required: "Username is required" }}
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
          <div className="flex items-center gap-2 h-full select-none">
            <input
              {...register("receive_text_messages")}
              type="checkbox"
              id="receive_text"
              className="accent-brown dark:accent-dark-brown cursor-pointer"
            />
            <label
              htmlFor="receive_text"
              className="text-sm font-medium text-gray-700 dark:text-zinc-300 cursor-pointer"
            >
              Receive Text Messages
            </label>
          </div>
        </div>

        <h6 className="text-xl font-medium mb-1 mt-3 text-gray-900 dark:text-zinc-100">
          Mailing Address
        </h6>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-1 sm:px-2 pt-2 pb-4 rounded-md">
          <FormInput
            name="address_1"
            label="Address 1"
            placeholder="House/Road"
          />
          <FormInput
            name="address_2"
            label="Address 2"
            placeholder="Apt/Suite"
          />
          <FormInput name="city" label="City" placeholder="City" />
          <FormInput
            name="state"
            label="State/Province/Region"
            placeholder="State"
          />
          <FormInput
            name="zip"
            label="Zip/Postal Code"
            placeholder="Zip Code"
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
                placeholder="Select Country"
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
                label="State"
                placeholder="State"
              />
              <FormInput name="mailing_zip" label="Zip" placeholder="Zip" />
            </div>
          </>
        )}

        <h6 className="text-xl font-medium mb-1 mt-3 text-gray-900 dark:text-zinc-100">
          Course & Admin Details
        </h6>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-1 sm:px-2 pt-2 pb-4 rounded-md">
          <FormInput
            name="code"
            label="Student Code"
            placeholder="e.g. CPR-2026-X"
          />
          <FormInput name="score" label="Score" placeholder="e.g. 95" />
          <FormInput
            name="e_card_code"
            label="E-Card Code"
            placeholder="ECARD-XXXX"
          />
          <FormInput
            name="how_did_you_hear"
            label="How did you hear?"
            placeholder="e.g. Google Search"
          />
          <FormInput
            name="instructor_interest_notes"
            label="Instructor Interest Notes"
            placeholder="Notes..."
          />
          <div className="md:col-span-2">
            <FormInput
              name="comment"
              label="Comment"
              placeholder="Internal comments..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-5 lg:mt-10">
          <BackButton />
          <Button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:opacity-90 transition focus:outline-none"
          >
            {isPending ? "Processing..." : "Add Student"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default AddStudentPage;
