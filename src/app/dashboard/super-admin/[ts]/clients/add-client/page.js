"use client";

import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { getAllCountry, storeClient } from "@/hooks/api/dashboardApi";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import { toast } from "sonner";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

const Page = () => {
  const sharedNotesRef = useRef(null);
  const internalNotesRef = useRef(null);
  const form = useForm({
    defaultValues: {
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
      sharedNotes: "",
      internalNotes: "",
    },
  });

  const {
    control,
    reset,
    formState: { errors },
  } = form;
  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  const { mutateAsync: storeClientMutation, isPending } = storeClient();

  const onSubmit = async (data) => {
    const sharedNotes = sharedNotesRef.current?.getContent();
    const internalNotes = internalNotesRef.current?.getContent();

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

    await storeClientMutation(formData, {
      onSuccess: (data) => {
        reset();
        sharedNotesRef.current?.clear();
        internalNotesRef.current?.clear();

        toast.success(data?.message || "Client added successfully");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };
  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      <SectionTitle title={"Add Client"} />
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
            <FormInput
              name="company"
              label="Company"
              placeholder="User name here"
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
            />
            <FormInput
              name="contactDate"
              label="Contact Date"
              placeholder="Date"
              type="date"
            />

            <FormInput name="website" label="Website" placeholder="Website" />

            <FormInput
              name="mainPhone"
              label="Main Phone"
              placeholder="Phone"
            />

            <FormInput
              name="mobilePhone"
              label="Mobile Phone"
              placeholder="Mobile"
            />
            <FormInput name="fax" label="Fax" placeholder="Fax here" />

            <FormInput
              name="address1"
              label="Address 1"
              placeholder="Address"
            />
            <FormInput
              name="address2"
              label="Address 2"
              placeholder="Address"
            />

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
            <h6 className="leading-[1.45] mb-2.5 font-medium text-base">
              Shared Notes
            </h6>
            <RichTextEditor ref={sharedNotesRef} />
          </div>
          <div>
            <h6 className="leading-[1.45] mb-2.5 font-medium text-base">
              Internal Notes
            </h6>
            <RichTextEditor ref={internalNotesRef} />
          </div>

          <div className="flex items-center justify-end">
            <div className="flex justify-end gap-4 mt-4 lg:mt-8">
              {/* <Button
                type="button"
                className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50 focus:outline-none"
              >
                Back
              </Button> */}
              <Button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none"
                disabled={isPending}
              >
                {isPending ? "Adding ..." : " Add Client"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default Page;
