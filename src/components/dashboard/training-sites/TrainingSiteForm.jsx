// src/components/dashboard/trainingSites/TrainingSiteForm.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import BackButton from "@/components/common/BackButton";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { Button } from "@/components/ui/button";
import { getAllCountry } from "@/hooks/api/dashboardApi";
import SiteCoordinatorField from "./SiteCoordinatorField";
import { useDefaultCountry } from "@/hooks/useDefaultCountry";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

const PRICE_LEVEL_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: String(i + 1),
}));

const DEFAULT_VALUES = {
  company: "",
  trainingSite: "",
  contact_first_name: "",
  contact_last_name: "",
  address1: "",
  address2: "",
  city: "",
  fax: "",
  stateProvince: "",
  zipPostalCode: "",
  country: "",
  mobilePhone: "",
  emailAddress: "",
  trainingsiteid: "",
  price_level: "",
  sales_tax_rate: "",
  enable_cert_print: false,
  send_reminders: false,
  allow_bid: false,
  restrict_product: false,
  restrict_view: false,
  user_id: "",
};

const TrainingSiteForm = ({
  defaultValues,
  notesInitial,
  coordinatorLabelInitial,
  onSubmit,
  isPending,
  isEdit = false,
}) => {
  const notesRef = useRef(null);
  const [notesReady, setNotesReady] = useState(false);
  const [coordinatorLabel, setCoordinatorLabel] = useState(
    coordinatorLabelInitial ?? "",
  );

  const form = useForm({ mode: "onBlur", defaultValues: DEFAULT_VALUES });
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = form;

  const { data: countryData, isLoading: countryLoading } = getAllCountry();

  useDefaultCountry({
    form,
    countryData,
    countryLoading,
    fieldName: "country",
  });

  useEffect(() => {
    if (defaultValues) {
      reset({ ...DEFAULT_VALUES, ...defaultValues });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (coordinatorLabelInitial) {
      setCoordinatorLabel(coordinatorLabelInitial);
    }
  }, [coordinatorLabelInitial]);

  useEffect(() => {
    if (notesReady && notesInitial) {
      notesRef.current?.setContents?.(notesInitial);
    }
  }, [notesReady, notesInitial]);

  const handleSubmit = data => {
    const notes = notesRef.current?.getContent?.() ?? "";

    const payload = {
      company_name: data.company,
      training_center_name: data.trainingSite,
      contact_first_name: data.contact_first_name,
      contact_last_name: data.contact_last_name,
      email: data.emailAddress,
      phone_number: data.mobilePhone,
      fax_number: data.fax || null,
      address_line_1: data.address1,
      address_line_2: data.address2 || null,
      city: data.city,
      state_province: data.stateProvince,
      postal_code: data.zipPostalCode,
      country: String(data.country),
      training_site_id: data.trainingsiteid || null,
      price_level: Number(data.price_level),
      sales_tax_rate: Number(data.sales_tax_rate) || 0,
      notes,
      enable_certification_card_printing: Boolean(data.enable_cert_print),
      send_reminders_to_instructors_with_unfinalized_rosters: Boolean(
        data.send_reminders,
      ),
      create_an_admin_user_for_this_site: Boolean(data.allow_bid),
      restrict_tc_product_orders_to_admins_only: Boolean(data.restrict_product),
      restrict_instructors_to_only_view_classes_they_teach: Boolean(
        data.restrict_view,
      ),
      user_id: data.user_id
        ? Number(data.user_id)
        : null,
    };

    onSubmit(payload, { reset, notesRef });
  };

  return (
    <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 shadow-sm">
      <FormContainer form={form} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormInput
            name="company"
            label="Company"
            placeholder="Company name"
            rules={{ required: "Company is required" }}
          />
          <FormInput
            name="trainingSite"
            label="Training Center Name"
            placeholder="Training center name"
            rules={{ required: "Training center name is required" }}
          />
          <FormInput
            name="contact_first_name"
            label="Contact First Name"
            placeholder="First name"
            rules={{ required: "First name is required" }}
          />
          <FormInput
            name="contact_last_name"
            label="Contact Last Name"
            placeholder="Last name"
            rules={{ required: "Last name is required" }}
          />
          <FormInput
            name="mobilePhone"
            label="Phone Number"
            placeholder="Phone number"
            rules={{
              required: "Phone number is required",
              minLength: { value: 10, message: "Minimum 10 digits" },
            }}
          />
          <FormInput name="fax" label="Fax (Optional)" placeholder="Fax" />
          <FormInput
            name="emailAddress"
            label="Email Address"
            placeholder="Email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            }}
          />
          <FormInput
            name="trainingsiteid"
            label="Training Site ID (Optional)"
            placeholder="ID"
          />
          <FormInput
            name="address1"
            label="Address 1"
            placeholder="Address"
            rules={{ required: "Address is required" }}
          />
          <FormInput
            name="address2"
            label="Address 2 (Optional)"
            placeholder="Address"
          />
          <FormInput
            name="city"
            label="City"
            placeholder="City"
            rules={{ required: "City is required" }}
          />
          <FormInput
            name="stateProvince"
            label="State / Province"
            placeholder="State"
            rules={{ required: "State is required" }}
          />
          <FormInput
            name="zipPostalCode"
            label="Zip / Postal Code"
            placeholder="Postal code"
            rules={{ required: "Postal code is required" }}
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
                isLoading={countryLoading}
                options={countryData?.data}
                error={errors.country?.message}
              />
            )}
          />

          <Controller
            name="price_level"
            control={control}
            rules={{ required: "Price level is required" }}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Price Level"
                placeholder="Select price level"
                options={PRICE_LEVEL_OPTIONS}
                error={errors.price_level?.message}
              />
            )}
          />

          <FormInput
            name="sales_tax_rate"
            label="Sales Tax Rate (%)"
            placeholder="e.g. 8.5"
          />
        </div>

        {/* Options + Site Coordinator, side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm text-gray-700 dark:text-gray">
              Options
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex w-fit cursor-pointer gap-2 items-center dark:text-gray">
                <input
                  {...register("enable_cert_print")}
                  type="checkbox"
                  className="accent-brown"
                />
                Enable certification card printing
              </label>
              <label className="flex w-fit cursor-pointer gap-2 items-center dark:text-gray">
                <input
                  {...register("send_reminders")}
                  type="checkbox"
                  className="accent-brown"
                />
                Send reminders to instructors with unfinalized rosters
              </label>
              <label className="flex w-fit cursor-pointer gap-2 items-center dark:text-gray">
                <input
                  {...register("allow_bid")}
                  type="checkbox"
                  className="accent-brown"
                />
                Create an admin user for this site
              </label>
              <label className="flex w-fit cursor-pointer gap-2 items-center dark:text-gray">
                <input
                  {...register("restrict_product")}
                  type="checkbox"
                  className="accent-brown"
                />
                Restrict TC product orders to admins only
              </label>
              <label className="flex w-fit cursor-pointer gap-2 items-center dark:text-gray">
                <input
                  {...register("restrict_view")}
                  type="checkbox"
                  className="accent-brown"
                />
                Restrict instructors (non-admins) to only view classes they
                teach
              </label>
            </div>
          </div>

          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <SiteCoordinatorField
                value={field.value}
                onChange={field.onChange}
                selectedLabel={coordinatorLabel}
                onSelectLabel={setCoordinatorLabel}
              />
            )}
          />
        </div>

        {/* Notes */}
        <div className="mt-6">
          <h6 className="leading-[1.45] mb-2.5 font-medium text-base text-black dark:text-gray">
            Notes
          </h6>
          <RichTextEditor ref={notesRef} onReady={() => setNotesReady(true)} />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <BackButton />
          <Button
            type="submit"
            disabled={isPending}
            className="bg-brown dark:bg-dark-brown hover:bg-brown-hover text-white cursor-pointer disabled:opacity-50"
          >
            {isPending ? "Saving..." : isEdit ? "Save Changes" : "Save Changes"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default TrainingSiteForm;
