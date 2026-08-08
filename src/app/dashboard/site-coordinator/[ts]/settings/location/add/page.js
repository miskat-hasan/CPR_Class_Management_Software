"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormTextarea from "@/components/shared/form/FormTextarea";
import { getAllCountry, storeLocation } from "@/hooks/api/dashboardApi";
import Link from "next/link";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import BackButton from "@/components/common/BackButton";

const Page = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      Abbreviation: "",
      ContactName: "",
      ContactEmail: "",
      ContactPhone: "",
      Directions: "",
      InternalNotes: "",
      PrintOnCards: false,
      address1: "",
      address2: "",
      city: "",
      stateProvince: "",
      zipPostalCode: "",
      country: "",
    },
  });

  const {
    control,
    reset,
    formState: { errors },
  } = form;

  const { user, selectedTrainingSiteId } = useAuth();

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  const { mutateAsync: storeLocationMutation, isPending } = storeLocation();

  const onSubmit = async data => {
    const formData = new FormData();

    formData.append("created_by", user?.id);
    formData.append("training_site_id", selectedTrainingSiteId);

    formData.append("name", data.name);
    formData.append("abbreviation", data.Abbreviation);
    formData.append("contact_name", data.ContactName);
    formData.append("contact_email", data.ContactEmail);
    formData.append("contact_phone", data.ContactPhone);
    formData.append("directions", data.Directions);
    formData.append("internal_notes", data.InternalNotes);
    formData.append("print_card_line_2", data.PrintOnCards);
    formData.append("address_1", data.address1);
    formData.append("address_2", data.address2 || "");
    formData.append("city", data.city);
    formData.append("state", data.stateProvince);
    formData.append("zip", data.zipPostalCode);
    formData.append("country", data.country);

    await storeLocationMutation(formData, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      {/* Title */}
      <SectionTitle title="My Account" />

      {/* White Form Card */}
      <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 shadow-sm">
        <SectionTitle title="Basic Information" className={"mb-1.5 lg:mb-3"} />
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-3.5 mb-5">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 ">
              <FormInput name="name" label="Name" placeholder="name here" />
              <FormInput
                name="Abbreviation"
                label="Abbreviation"
                placeholder="Abbreviation here"
              />
              {/* <CustomSelect
                id="Abbreviation"
                label="Abbreviation"
                placeholder="Abbreviation"
                options={[
                  {
                    value: "abbreviation 1",
                    label: "abbreviation 1",
                  },
                ]}
                // onChange={(val) => handleSelectChange("instructor", val)}
                className="flex-1"
              /> */}
            </div>

            <FormTextarea
              name={"Directions"}
              label={"Directions"}
              placeholder={"Directions here"}
            />
            {/* <div className="flex flex-col gap-1.5 md:gap-2.5">
              <p className="font-semibold text-[15px] text-gray-700">Options</p>
              <label className="flex items-center gap-2 text-[12px] sm:text-sm">
                <input type="checkbox" className="accent-brown" />
                Make this location my default selection when creating classes
              </label>
            </div> */}
            <FormInput
              name="PrintOnCards"
              label="Print on Cards"
              placeholder="Print on Cards here"
            />
          </div>

          <SectionTitle title="Advanced Information" className={"mb-3"} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <FormInput
              name="address1"
              label="Address 1"
              placeholder="Address here"
            />
            <FormInput
              name="address2"
              label="Address 2"
              placeholder="Address here"
            />

            <FormInput name="city" label="City" placeholder="City" />
            <FormInput
              name="stateProvince"
              label="State / Province / Region"
              placeholder="State"
            />

            <div className="col-span-full w-full flex flex-col gap-3 md:gap-6">
              <FormInput
                name="zipPostalCode"
                label="Zip / Postal Code"
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
          </div>

          {/* <div className="flex flex-col gap-2 my-2 lg:my-4">
            <p className="font-semibold text-[15px] text-gray-700">Options</p>
            <label className="flex items-center gap-2 text-[12px] sm:text-sm">
              <input type="checkbox" className="accent-brown" />
              Include address in class communications
            </label>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 ">
            <FormInput
              name="ContactName"
              label="Contact Name"
              placeholder="Contact Name here"
            />
            <FormInput
              name="ContactEmail"
              label="Contact Email"
              placeholder="Contact Email here"
            />
            <FormInput
              name="ContactPhone"
              label="Contact Phone"
              placeholder="Contact Phone here"
            />
            <FormInput
              name="InternalNotes"
              label="Internal Notes"
              placeholder="Internal Notes here"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-5 lg:mt-10">
            <BackButton />
            <Button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown "
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default Page;
