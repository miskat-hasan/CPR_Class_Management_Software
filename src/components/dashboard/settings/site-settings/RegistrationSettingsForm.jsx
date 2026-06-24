// src/components/dashboard/site-settings/RegistrationSettingsForm.jsx
"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  useGetSiteSettings,
  useUpdateSiteSettings,
} from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

// const SCHEDULE_PAGE_FORMATS = ["Class List", "Calendar", "Dual Calendar"];

const OPTIONS = [
  {
    key: "use_accordion_display",
    label: "Use an accordion display on the class schedule page",
  },
  {
    key: "require_agreement_to_terms",
    label: "Require registrants to agree to the terms and conditions",
  },
  {
    key: "display_class_times",
    label: "Display class end times in the schedule",
  },
  { key: "include_test_scores", label: "Include test scores on the roster" },
  {
    key: "send_ecard_emails_by_default",
    label: "Send eCard emails from Enrollware by default",
  },
  {
    key: "show_promo_codes",
    label: "Show promo codes in the 'codes' column of the student lists",
  },
  {
    key: "restrict_instructors",
    label: "Restrict instructors (non-admins) to only view classes they teach",
  },
  {
    key: "enable_class_registration_closes",
    label: "Enable class registrations to be closed prior to class start time",
  },
  {
    key: "print_terms_and_conditions",
    label: "Print the terms and conditions in the student receipt",
  },
  {
    key: "include_confirm_email_field",
    label: 'Include a "Confirm Email" field on the registration page',
  },
  {
    key: "prompt_mobile_phone",
    label:
      'Prompt registrants for a mobile phone number instead of "Primary Phone"',
  },
  {
    key: "allow_international_addresses",
    label: "Allow international addresses for student registrations",
  },
  {
    key: "hide_registration_comment_box",
    label: "Hide Registration Comment Box",
  },
  { key: "enable_mfa", label: "Enable Multi-factor Authentication (MFA)" },
  {
    key: "enable_custom_confirmation_pages",
    label: "Enable Custom Confirmation Pages",
  },
];

const REGISTRATION_TOGGLES = [
  { key: "display_secure_site_message", label: "Display Secure Site Message" },
  { key: "enable_search_filter", label: "Enable Search Filter" },
  { key: "enable_location_filter", label: "Enable Location Filter" },
  { key: "enable_course_filter", label: "Enable Course Filter" },
  { key: "enable_datetime_filter", label: "Enable Date/Time Filter" },
];

const SectionHeading = ({ children }) => (
  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b dark:border-gray-700 pb-2 mb-1">
    {children}
  </h4>
);

const RegistrationSettingsForm = () => {
  const { data: settingsData, isLoading } = useGetSiteSettings(
    "registration_settings",
  );
  const { mutate: updateSettings, isPending } = useUpdateSiteSettings();

  const schedulePageTextRef = useRef(null);
  const termsRef = useRef(null);
  const textingPrivacyRef = useRef(null);
  const customSidebarRef = useRef(null);

  const form = useForm({
    defaultValues: {
      site_name: "",
      schedule_page_format: "Class List",
      logo_url: "",
      contact_us_email: "",
      mail_from_display_name: "",
      mail_from_address: "",
      google_analytics_4_id: "",
      confirmation_script: "",
      check_in_password: "",
      check_in_link: "",
      bid_notifications_to: "",
      options: Object.fromEntries(OPTIONS.map(o => [o.key, false])),
      registration_toggles: Object.fromEntries(
        REGISTRATION_TOGGLES.map(t => [t.key, false]),
      ),
    },
  });

  const { register, reset, watch } = form;

  useEffect(() => {
    if (settingsData?.data) {
      const d = settingsData.data;

      reset({
        ...d,
        options: {
          ...Object.fromEntries(OPTIONS.map(o => [o.key, false])),
          ...d.options,
        },
        registration_toggles: {
          ...Object.fromEntries(REGISTRATION_TOGGLES.map(t => [t.key, false])),
          ...d.registration_toggles,
        },
      });

      if (schedulePageTextRef.current && d?.schedule_page_text_html) {
        schedulePageTextRef.current?.setContents?.(
          d?.schedule_page_text_html ?? "",
        );
      }
      if (termsRef.current && d?.terms_and_conditions_html) {
        termsRef.current?.setContents?.(d?.terms_and_conditions_html ?? "");
      }
      if (textingPrivacyRef.current && d?.texting_privacy_policy) {
        textingPrivacyRef.current?.setContents?.(
          d?.texting_privacy_policy ?? "",
        );
      }

      if (customSidebarRef.current && d?.custom_sidebar_html) {
        customSidebarRef.current?.setContents?.(d?.custom_sidebar_html ?? "");
      }
    }
  }, [
    settingsData,
    reset,
    customSidebarRef.current,
    schedulePageTextRef.current,
    termsRef.current,
    textingPrivacyRef.current,
  ]);

  const onSubmit = data => {
    const payload = {
      group: "registration_settings",
      ...data,
      schedule_page_text_html:
        schedulePageTextRef.current?.getContent?.() ?? "",
      terms_and_conditions_html: termsRef.current?.getContent?.() ?? "",
      texting_privacy_policy: textingPrivacyRef.current?.getContent?.() ?? "",
      custom_sidebar_html: customSidebarRef.current?.getContent?.() ?? "",
    };
    updateSettings(payload, {
      onSuccess: res =>
        toast.success(res?.message ?? "Settings updated successfully."),
      onError: err =>
        toast.error(
          err?.response?.data?.message ?? "Failed to update settings.",
        ),
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md"
          />
        ))}
      </div>
    );
  }

  const schedulePageFormat = watch("schedule_page_format");

  return (
    <FormContainer form={form} onSubmit={onSubmit}>
      <div className="flex flex-col gap-5">
        {/* Site Identity */}
        <SectionHeading>Site Identity</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="site_name"
            label="Site Name"
            placeholder="yoursite"
          />

          {/* Schedule Page Format */}
          {/* <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray">
              Schedule Page Format
            </label>
            <select
              {...register("schedule_page_format")}
              className="border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {SCHEDULE_PAGE_FORMATS.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div> */}
          {/* Registration Links — read-only display */}
          {settingsData?.data?.registration_links?.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray">
                Registration Links
              </label>
              <div className="flex flex-col gap-1 text-sm text-blue-600">
                {settingsData.data.registration_links.map(link => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* iCal Feed URL — read-only */}
        {settingsData?.data?.ical_feed_url && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray">
              iCal Feed URL
            </label>
            <p className="text-sm text-blue-600 break-all">
              <a
                href={settingsData.data.ical_feed_url}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {settingsData.data.ical_feed_url}
              </a>
            </p>
          </div>
        )}

        {/* Schedule Page Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray">
            Schedule Page Text
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <RichTextEditor ref={schedulePageTextRef} />
          </div>
        </div>

        {/* Options */}
        <SectionHeading>Options</SectionHeading>
        <div className="flex flex-col gap-2">
          {OPTIONS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray w-fit"
            >
              <input
                type="checkbox"
                {...register(`options.${key}`)}
                className="accent-brown"
              />
              {label}
            </label>
          ))}
        </div>

        {/* Logo & Email */}
        <SectionHeading>Branding &amp; Email</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="logo_url"
            label="Logo URL"
            placeholder="/sites/yoursite/logo.png"
          />
          <FormInput
            name="contact_us_email"
            label="'Contact Us' Email Address"
            placeholder="contact@example.com"
          />
          <FormInput
            name="mail_from_display_name"
            label="Mail From Display Name"
            placeholder="Company Name"
          />
          <FormInput
            name="mail_from_address"
            label="Mail From Address"
            placeholder="noreply@example.com"
          />
          <FormInput
            name="bid_notifications_to"
            label="Bid Notifications To"
            placeholder="email@example.com"
          />
          <FormInput
            name="google_analytics_4_id"
            label="Google Analytics 4 (GA4) Account ID"
            placeholder="G-XXXXXXXX"
          />
        </div>

        {/* Confirmation Script */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray">
            Confirmation Script
          </label>
          <textarea
            {...register("confirmation_script")}
            rows={4}
            placeholder="Text shown after successful registration..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray">
            Terms and Conditions
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <RichTextEditor ref={termsRef} />
          </div>
        </div>

        {/* Texting Privacy Policy */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray">
            Texting Privacy Policy
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <RichTextEditor ref={textingPrivacyRef} />
          </div>
        </div>

        {/* Custom Sidebar */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray">
            Custom Sidebar
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <RichTextEditor ref={customSidebarRef} />
          </div>
        </div>

        {/* Registration Toggles */}
        <SectionHeading>Registration Toggles</SectionHeading>
        <div className="flex flex-col gap-2">
          {REGISTRATION_TOGGLES.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray w-fit"
            >
              <input
                type="checkbox"
                {...register(`registration_toggles.${key}`)}
                className="accent-brown"
              />
              {label}
            </label>
          ))}
        </div>

        {/* Check-in */}
        <SectionHeading>Check-in</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="check_in_password"
            label="Check-in Password"
            placeholder="Password"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray">
              Check-in Link
            </label>
            {settingsData?.data?.check_in_link ? (
              <a
                href={settingsData.data.check_in_link}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {settingsData.data.check_in_link}
              </a>
            ) : (
              <p className="text-sm text-gray-400 italic">—</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setTimeout(() => {
                const d = settingsData?.data;
                schedulePageTextRef.current?.setContents?.(
                  d?.schedule_page_text_html ?? "",
                );
                termsRef.current?.setContents?.(
                  d?.terms_and_conditions_html ?? "",
                );
                textingPrivacyRef.current?.setContents?.(
                  d?.texting_privacy_policy ?? "",
                );
                customSidebarRef.current?.setContents?.(
                  d?.custom_sidebar_html ?? "",
                );
              }, 150);
            }}
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

export default RegistrationSettingsForm;
