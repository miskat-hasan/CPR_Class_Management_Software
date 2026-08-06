// src/components/dashboard/clients/ClientForm.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import BackButton from "@/components/common/BackButton";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { getAllCountry } from "@/hooks/api/dashboardApi";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

const DEFAULT_VALUES = {
  company: "",
  abbreviation: "",
  contactFirstName: "",
  contactLastName: "",
  emailAddress: "",
  contactDate: "",
  website: "",
  mainPhone: "",
  mobilePhone: "",
  fax: "",
  country: "",
  address1: "",
  address2: "",
  city: "",
  stateProvince: "",
  zipPostalCode: "",
  ccConfirmationsTo: "",
};

const ClientForm = ({
  defaultValues,
  sharedNotesInitial,
  internalNotesInitial,
  onSubmit,
  isPending,
  isEdit = false,
}) => {
  const sharedNotesRef = useRef(null);
  const internalNotesRef = useRef(null);
  const [sharedReady, setSharedReady] = useState(false);
  const [internalReady, setInternalReady] = useState(false);

  const form = useForm({ defaultValues: DEFAULT_VALUES });
  const {
    control,
    reset,
    formState: { errors },
  } = form;

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  useEffect(() => {
    if (defaultValues) {
      reset({ ...DEFAULT_VALUES, ...defaultValues });
    }
  }, [defaultValues, reset]);

  // Only push content into the editor once it has actually mounted —
  // same onReady guard used for the course description/email editors.
  useEffect(() => {
    if (sharedReady && sharedNotesInitial) {
      sharedNotesRef.current?.setContents?.(sharedNotesInitial);
    }
  }, [sharedReady, sharedNotesInitial]);

  useEffect(() => {
    if (internalReady && internalNotesInitial) {
      internalNotesRef.current?.setContents?.(internalNotesInitial);
    }
  }, [internalReady, internalNotesInitial]);

  const handleSubmit = data => {
    const sharedNotes = sharedNotesRef.current?.getContent?.() ?? "";
    const internalNotes = internalNotesRef.current?.getContent?.() ?? "";

    const formData = new FormData();
    formData.append("company", data.company);
    formData.append("abbreviation", data.abbreviation);
    formData.append("contact_first_name", data.contactFirstName);
    formData.append("contact_last_name", data.contactLastName);
    formData.append("email", data.emailAddress);
    formData.append("contact_date", data.contactDate);
    formData.append("website", data.website);
    formData.append("main_phone", data.mainPhone);
    formData.append("mobile_phone", data.mobilePhone);
    formData.append("fax", data.fax);
    formData.append("country_id", data.country);
    formData.append("address_1", data.address1);
    formData.append("address_2", data.address2);
    formData.append("city", data.city);
    formData.append("state", data.stateProvince);
    formData.append("zip", data.zipPostalCode);
    formData.append("cc_confirmations_to", data.ccConfirmationsTo);
    formData.append("shared_notes", sharedNotes);
    formData.append("internal_notes", internalNotes);

    onSubmit(formData, { reset, sharedNotesRef, internalNotesRef });
  };

  return (
    <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
      <FormContainer form={form} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
          <FormInput
            name="company"
            label="Company"
            placeholder="Company name"
            rules={{ required: "Company is required" }}
          />
          <FormInput
            name="abbreviation"
            label="Abbreviation"
            placeholder="Abbreviation"
          />

          <FormInput
            name="contactFirstName"
            label="Contact First Name"
            placeholder="First name here"
          />
          <FormInput
            name="contactLastName"
            label="Contact Last Name"
            placeholder="Last name here"
          />

          <FormInput
            name="emailAddress"
            label="Email Address"
            placeholder="Email here"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
          />
          <FormInput
            name="contactDate"
            label="Contact Date"
            placeholder="Date"
            type="date"
          />

          <FormInput name="website" label="Website" placeholder="Website" />
          <FormInput name="mainPhone" label="Main Phone" placeholder="Phone" />

          <FormInput
            name="mobilePhone"
            label="Mobile Phone"
            placeholder="Mobile"
          />
          <FormInput name="fax" label="Fax" placeholder="Fax here" />

          <FormInput name="address1" label="Address 1" placeholder="Address" />
          <FormInput name="address2" label="Address 2" placeholder="Address" />

          <FormInput name="city" label="City" placeholder="City" />
          <FormInput
            name="stateProvince"
            label="State/Province/Region"
            placeholder="State"
          />

          <FormInput
            name="zipPostalCode"
            label="Zip/Postal Code"
            placeholder="Postal code"
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
                placeholder="Country"
                isLoading={countryDataLoading}
                options={countryData?.data}
                error={errors.country?.message}
                className="flex-1"
              />
            )}
          />
        </div>

        <FormInput
          name="ccConfirmationsTo"
          label="CC Confirmations To"
          placeholder="CC Confirmations To"
        />

        <div>
          <h6 className="leading-[1.45] mb-2.5 font-medium text-base text-black dark:text-gray">
            Shared Notes
          </h6>
          <RichTextEditor
            ref={sharedNotesRef}
            onReady={() => setSharedReady(true)}
          />
        </div>
        <div>
          <h6 className="leading-[1.45] mb-2.5 font-medium text-base text-black dark:text-gray">
            Internal Notes
          </h6>
          <RichTextEditor
            ref={internalNotesRef}
            onReady={() => setInternalReady(true)}
          />
        </div>

        <div className="flex items-center justify-end">
          <div className="flex justify-end gap-4 mt-4 lg:mt-8">
            <BackButton />
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                  ? "Update Client"
                  : "Add Client"}
            </Button>
          </div>
        </div>
      </FormContainer>
    </div>
  );
};

export default ClientForm;
