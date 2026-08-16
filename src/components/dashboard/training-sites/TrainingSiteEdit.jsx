"use client";
import {
  createSingleTrainingSite,
  getSingleTrainingsite,
  updateTrainingSite,
} from "@/hooks/api/dashboardApi";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";

const TrainingSiteEdit = ({ slug }) => {
  const { data, isLoading } = getSingleTrainingsite(slug);

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
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
    },
  });

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (data) {
      reset({
        company: data?.data?.company_name ?? "",
        trainingSite: data?.data?.trainingSite ?? "",
        contact_first_name: data?.data?.contact_first_name ?? "",
        contact_last_name: data?.data?.contact_last_name ?? "",
        address1: data?.data?.address_line_1 ?? "",
        address2: data?.data?.address_line_2 ?? "",
        city: data?.data?.city ?? "",
        fax: data?.data?.fax_number ?? "",
        stateProvince: data?.data?.state_province ?? "",
        zipPostalCode: data?.data?.postal_code ?? "",
        country: data?.data?.country ?? "",
        mobilePhone: data?.data?.phone_number ?? "",
        emailAddress: data?.data?.email ?? "",
        trainingsiteid: data?.data?.training_site_id ?? "",
        price_level: data?.data?.price_level ?? "",
        sales_tax_rate: data?.data?.sales_tax_rate ?? "",
        enable_cert_print: !!data?.data?.enable_cert_print,
        send_reminders: !!data?.data?.send_reminders,
        allow_bid: !!data?.data?.allow_bid,
        restrict_product: !!data?.data?.restrict_product,
        restrict_view: !!data?.data?.restrict_view,
      });
    }
  }, [data, reset]);

  const { mutateAsync: trainingSiteEditMutation, isPending } =
    updateTrainingSite(slug);

  const onSubmit = async(data) => {
    const formData = new FormData();

    formData.append("company_name", data?.company);
    formData.append("training_center_name", data?.trainingSite);
    formData.append("contact_first_name", data?.contact_first_name);
    formData.append("contact_last_name", data?.contact_last_name);
    formData.append("email", data?.emailAddress);
    formData.append("phone_number", data?.mobilePhone);
    formData.append("fax_number", data?.fax || "");
    formData.append("address_line_1", data?.address1);
    formData.append("address_line_2", data?.address2 || "");
    formData.append("city", data?.city);
    formData.append("state_province", data?.stateProvince);
    formData.append("postal_code", data?.zipPostalCode);
    formData.append("country", data?.country);
    formData.append("training_site_id", data?.trainingsiteid || "");
    formData.append("price_level", Number(data?.price_level));
    formData.append("sales_tax_rate", Number(data?.sales_tax_rate) || 0);

    await trainingSiteEditMutation(formData);
  };
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Update Training Site" />

      <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 shadow-sm">
        <FormContainer form={form} onSubmit={handleSubmit(onSubmit)}>
          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormInput
              name="company"
              label="Company"
              placeholder="Company name here"
              rules={{ required: "Company is required" }}
            />

            <Controller
              name="trainingSite"
              control={control}
              rules={{ required: "Training Center is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="Training Center"
                  placeholder="Training Center"
                  options={[
                    {
                      value: "CODE BLUE CPR SERVICES. LLC",
                      label: "CODE BLUE CPR SERVICES. LLC",
                    },
                  ]}
                  error={errors.trainingSite?.message}
                />
              )}
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
              name="address1"
              label="Address 1"
              placeholder="Address"
              rules={{ required: "Address is required" }}
            />

            <FormInput
              name="address2"
              label="Address 2"
              placeholder="Address"
            />

            <FormInput
              name="city"
              label="City"
              placeholder="City"
              rules={{ required: "City is required" }}
            />

            <FormInput name="fax" label="Fax" placeholder="Fax" />

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
                  placeholder="Country"
                  options={[
                    { value: "germany", label: "Germany" },
                    { value: "canada", label: "Canada" },
                  ]}
                  error={errors.country?.message}
                />
              )}
            />

            <FormInput
              name="mobilePhone"
              label="Mobile Phone"
              placeholder="Mobile"
              rules={{
                required: "Mobile number is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 digits",
                },
              }}
            />

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
              label="Training Site ID"
              placeholder="ID"
            />

            <Controller
              name="price_level"
              control={control}
              rules={{ required: "Price level is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="Price Level"
                  placeholder="Price Level"
                  options={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                  ]}
                  error={errors.price_level?.message}
                />
              )}
            />

            <FormInput
              name="sales_tax_rate"
              label="Sales Tax Rate"
              placeholder="Rate"
            />
          </div>

          {/* OPTIONS */}
          <div className="mt-6">
            <p className="font-semibold text-gray-700 mb-2">Options</p>

            <div className="flex flex-col gap-2 text-sm">
              <label className="flex gap-2">
                <input {...register("enable_cert_print")} type="checkbox" />
                Enable certification card printing{" "}
              </label>

              <label className="flex gap-2">
                <input {...register("send_reminders")} type="checkbox" />
                Send reminders to instructors with unfinalized rosters
              </label>

              <label className="flex gap-2">
                <input {...register("allow_bid")} type="checkbox" />
                Create an admin user for this site
              </label>

              <label className="flex gap-2">
                <input {...register("restrict_product")} type="checkbox" />
                Restrict TC product orders to admins only
              </label>

              <label className="flex gap-2">
                <input {...register("restrict_view")} type="checkbox" />
                Restrict instructors (non-admins) to only view classes they
                teach
              </label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-8">
            {/* <Button type="button" variant="outline">
              Back
            </Button> */}

            <Button
              type="submit"
              className="bg-brown dark:bg-dark-brown hover:bg-brown  text-white cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Saving ..." : "Save Changes"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default TrainingSiteEdit;
