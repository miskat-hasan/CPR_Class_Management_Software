// src/components/dashboard/site-settings/BasicSiteSettingsForm.jsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  useGetSiteSettings,
  useUpdateSiteSettings,
} from "@/hooks/api/dashboardApi";
import { toast } from "sonner";

const CHECKBOX_FIELDS = [
  {
    name: "send_notifications_for_internal_rosters",
    label: "Send notifications for internal rosters",
  },
  {
    name: "allow_ts_admins_to_upload_instructor_documents",
    label: "Allow TS admins to upload instructor documents",
  },
  {
    name: "require_an_email_address_for_all_students",
    label: "Require an email address for all students",
  },
  {
    name: "prevent_sites_from_modifying_finalized_rosters",
    label: "Prevent sites from modifying finalized rosters",
  },
  {
    name: "allow_tc_admins_to_issue_training_site_inventory",
    label: "Allow TC admins to issue training site inventory",
  },
];

const SectionHeading = ({ children }) => (
  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b dark:border-gray-700 pb-2 mb-1">
    {children}
  </h4>
);

const BasicSiteSettingsForm = () => {
  const { data: settingsData, isLoading } = useGetSiteSettings("basic_setting");
  const { mutate: updateSettings, isPending } = useUpdateSiteSettings();

  const form = useForm({
    defaultValues: {
      company_name: "",
      tag_line: "",
      contact_first_name: "",
      contact_last_name: "",
      email_address: "",
      website: "",
      phone: "",
      fax: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      timezone: "",
      aha_training_center_name: "",
      aha_training_center_id: "",
      aha_training_site_id: "",
      american_red_cross_id: "",
      zapier_class_webhook: "",
      zapier_registration_webhook: "",
      zapier_registration_status_change_webhook: "",
      zapier_product_order_webhook: "",
      roster_tc_product_order_notifications_to: "",
      message_to_sites: "",
      send_notifications_for_internal_rosters: false,
      allow_ts_admins_to_upload_instructor_documents: false,
      require_an_email_address_for_all_students: false,
      prevent_sites_from_modifying_finalized_rosters: false,
      allow_tc_admins_to_issue_training_site_inventory: false,
    },
  });

  const { register, reset } = form;

  useEffect(() => {
    if (settingsData?.data) {
      reset(settingsData.data);
    }
  }, [settingsData, reset]);

  const onSubmit = data => {
    updateSettings(
      { group: "basic_setting", ...data },
      {
        onSuccess: res =>
          toast.success(res?.message ?? "Settings updated successfully."),
        onError: err =>
          toast.error(
            err?.response?.data?.message ?? "Failed to update settings.",
          ),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md"
          />
        ))}
      </div>
    );
  }

  return (
    <FormContainer form={form} onSubmit={onSubmit}>
      <div className="flex flex-col gap-5">
        {/* Company Info */}
        <SectionHeading>Company Info</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="company_name"
            label="Company"
            placeholder="Company name"
          />
          <FormInput name="tag_line" label="Tag Line" placeholder="Tag line" />
          <FormInput
            name="contact_first_name"
            label="Contact First Name"
            placeholder="First name"
          />
          <FormInput
            name="contact_last_name"
            label="Contact Last Name"
            placeholder="Last name"
          />
          <FormInput
            name="email_address"
            label="Email Address"
            placeholder="email@example.com"
          />
          <FormInput
            name="website"
            label="Website"
            placeholder="https://example.com"
          />
          <FormInput name="phone" label="Phone" placeholder="000-000-0000" />
          <FormInput name="fax" label="Fax" placeholder="000-000-0000" />
        </div>

        {/* Address */}
        <SectionHeading>Address</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="address_1"
            label="Address 1"
            placeholder="Street address"
          />
          <FormInput
            name="address_2"
            label="Address 2"
            placeholder="Suite, unit, etc."
          />
          <FormInput name="city" label="City" placeholder="City" />
          <FormInput
            name="state"
            label="State / Province / Region"
            placeholder="State"
          />
          <FormInput
            name="zip_code"
            label="Zip / Postal Code"
            placeholder="00000"
          />
          <FormInput name="country" label="Country" placeholder="Country" />
          <FormInput
            name="timezone"
            label="Time Zone"
            placeholder="(UTC-00:00)..."
          />
        </div>

        {/* AHA */}
        <SectionHeading>AHA / Red Cross</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="aha_training_center_name"
            label="AHA Training Center Name"
            placeholder=""
          />
          <FormInput
            name="aha_training_center_id"
            label="AHA Training Center ID"
            placeholder=""
          />
          <FormInput
            name="aha_training_site_id"
            label="AHA Training Site ID"
            placeholder=""
          />
          <FormInput
            name="american_red_cross_id"
            label="American Red Cross Account ID"
            placeholder=""
          />
        </div>

        {/* Zapier */}
        <SectionHeading>Zapier Webhooks</SectionHeading>
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            name="zapier_class_webhook"
            label="Zapier Class Webhook"
            placeholder="https://hooks.zapier.com/..."
          />
          <FormInput
            name="zapier_registration_webhook"
            label="Zapier Registration Webhook"
            placeholder="https://hooks.zapier.com/..."
          />
          <FormInput
            name="zapier_registration_status_change_webhook"
            label="Zapier Registration Status Change Webhook"
            placeholder="https://hooks.zapier.com/..."
          />
          <FormInput
            name="zapier_product_order_webhook"
            label="Zapier TC Product Order Webhook"
            placeholder="https://hooks.zapier.com/..."
          />
        </div>

        {/* Notifications & Options */}
        <SectionHeading>Notifications &amp; Options</SectionHeading>
        <FormInput
          name="roster_tc_product_order_notifications_to"
          label="Roster / TC Product Order Notifications To"
          placeholder="email@example.com"
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray">
            Message to Sites
          </label>
          <textarea
            {...register("message_to_sites")}
            rows={3}
            placeholder="Message shown to training sites..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          {CHECKBOX_FIELDS.map(({ name, label }) => (
            <label
              key={name}
              className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray w-fit"
            >
              <input
                type="checkbox"
                {...register(name)}
                className="accent-brown"
              />
              {label}
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset(settingsData?.data)}
            className="h-9 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-9 text-sm font-medium text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Update Settings"}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicSiteSettingsForm;
