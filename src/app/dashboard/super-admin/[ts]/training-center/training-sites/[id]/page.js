"use client";
import {
  getAllCountry,
  getallTrainingsite,
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
import BackButton from "@/components/common/BackButton";

const Page = ({ params }) => {
  const { id } = params;

  const { data: trainingSiteData, isLoading } = getSingleTrainingsite(id);

  const { data: trainingSitesData, isLoading: trainingSitesLoading } =
    getallTrainingsite();

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  const form = useForm({
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
      priceLevel: "",
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
    if (trainingSiteData) {
      reset({
        company: trainingSiteData?.data?.company_name ?? "",
        trainingSite: trainingSiteData?.data?.training_center_name ?? "",
        contact_first_name: trainingSiteData?.data?.contact_first_name ?? "",
        contact_last_name: trainingSiteData?.data?.contact_last_name ?? "",
        address1: trainingSiteData?.data?.address_line_1 ?? "",
        address2: trainingSiteData?.data?.address_line_2 ?? "",
        city: trainingSiteData?.data?.city ?? "",
        fax: trainingSiteData?.data?.fax_number ?? "",
        stateProvince: trainingSiteData?.data?.state_province ?? "",
        zipPostalCode: trainingSiteData?.data?.postal_code ?? "",
        country: trainingSiteData?.data?.country ?? "",
        mobilePhone: trainingSiteData?.data?.phone_number ?? "",
        emailAddress: trainingSiteData?.data?.email ?? "",
        trainingsiteid: trainingSiteData?.data?.training_site_id ?? "",
        priceLevel: trainingSiteData?.data?.price_level ?? "",
        sales_tax_rate: trainingSiteData?.data?.sales_tax_rate ?? "",
        enable_cert_print: Boolean(trainingSiteData?.data?.settings?.enable_certification_card_printing),
        send_reminders: Boolean(trainingSiteData?.data?.settings?.send_reminders_to_instructors_with_unfinalized_rosters),
        allow_bid: Boolean(trainingSiteData?.data?.settings?.create_an_admin_user_for_this_site),
        restrict_product: Boolean(trainingSiteData?.data?.settings?.restrict_tc_product_orders_to_admins_only),
        restrict_view: Boolean(trainingSiteData?.data?.settings?.restrict_instructors_to_only_view_classes_they_teach),
      });
    }
  }, [trainingSiteData, reset]);

  const { mutateAsync: trainingSiteEditMutation, isPending } =
    updateTrainingSite(id);

  const onSubmit = async (data) => {
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
    formData.append("price_level", Number(data?.priceLevel));
    formData.append("sales_tax_rate", Number(data?.sales_tax_rate) || 0);
    formData.append("enable_certification_card_printing", Number(data?.enable_cert_print) || 0);
    formData.append("send_reminders_to_instructors_with_unfinalized_rosters", Number(data?.send_reminders) || 0);
    formData.append("create_an_admin_user_for_this_site", Number(data?.allow_bid) || 0);
    formData.append("restrict_tc_product_orders_to_admins_only", Number(data?.restrict_product) || 0);
    formData.append("restrict_instructors_to_only_view_classes_they_teach", Number(data?.restrict_view) || 0);

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

           <FormInput
              name="trainingSite"
              label="Training Center"
              placeholder="Training Center"
              rules={{ required: "Training Center is required" }}
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
              name="priceLevel"
              control={control}
              rules={{ required: "Price level is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="Price Level"
                  placeholder="Price Level"
                  options={[
                    { id: "1", name: "1" },
                    { id: "2", name: "2" },
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
            <BackButton />

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

export default Page;
