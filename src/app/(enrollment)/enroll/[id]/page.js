// src/app/enroll/[id]/page.js
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getAllCountry,
  getEnrollmentDetails,
  useStudentEnrollment,
} from "@/hooks/api/dashboardApi";
import EnrollSidebar from "@/components/enrollment/EnrollSidebar";
import StepCourseOptions from "@/components/enrollment/StepCourseOptions";
import StepStudentInfo from "@/components/enrollment/StepStudentInfo";
import StepReviewPayment from "@/components/enrollment/StepReviewPayment";
import { useDefaultCountry } from "@/hooks/useDefaultCountry";

const Page = () => {
  const { id } = useParams();
  
  const [step, setStep] = useState(1);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      // Step 1 — course options
      addons: {},
      reschedule_insurance: "no",
      // Step 2 — student info
      first_name: "",
      last_name: "",
      email_address: "",
      confirm_email_address: "",
      mobile_phone: "",
      alternate_phone: "",
      username: "",
      password: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      receive_text_messages: "no",
      comments: "",
      promo_code: "",
      // registration questions — keyed by question id
      reg_questions: {},
    },
  });

  const { data, isLoading } = getEnrollmentDetails(id);
  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  useDefaultCountry({
    form,
    countryData,
    countryLoading: countryDataLoading,
    fieldName: "country",
  });

  const classDetails = data?.data?.class_details;
  const siteSettings = data?.data?.site_settings;
  const addonsList = data?.data?.addons ?? [];
  const registrationQuestions = data?.data?.registration_questions ?? [];

  const { mutate: submitEnrollment, isPending: isSubmitting } =
    useStudentEnrollment(id);

  const handleFinalSubmit = formValues => {
    const formData = new FormData();

    // Student info
    formData.append("first_name", formValues.first_name);
    formData.append("last_name", formValues.last_name);
    formData.append("email", formValues.email_address);
    formData.append("confirm_email", formValues.confirm_email_address);
    formData.append("primary_phone", formValues.mobile_phone);
    formData.append("alternate_phone", formValues.alternate_phone ?? "");
    formData.append("username", formValues.username);
    formData.append("password", formValues.password);
    formData.append("address_1", formValues.address_1);
    formData.append("address_2", formValues.address_2 ?? "");
    formData.append("city", formValues.city);
    formData.append("state", formValues.state);
    formData.append("zip", formValues.zip_code);
    formData.append("country_id", formValues.country);
    formData.append("promo_code", formValues.promo_code ?? "");
    formData.append(
      "receive_text_messages",
      formValues.receive_text_messages === "yes",
    );
    formData.append("comments", formValues.comments ?? "");

    // Add-ons
    if (formValues.addons) {
      Object.entries(formValues.addons).forEach(([addonId, selection]) => {
        if (selection === "yes") formData.append("addon_ids[]", addonId);
      });
    }

    // Reschedule insurance
    formData.append(
      "reschedule_insurance",
      formValues.reschedule_insurance === "yes",
    );

    // Registration questions
    registrationQuestions.forEach(q => {
      const answer = formValues.reg_questions?.[q.id];
      if (answer === undefined || answer === null || answer === "") return;
      if (q.type === "file_upload" && answer instanceof File) {
        formData.append(`reg_questions[${q.id}]`, answer);
      } else if (Array.isArray(answer)) {
        answer.forEach(v => formData.append(`reg_questions[${q.id}][]`, v));
      } else {
        formData.append(`reg_questions[${q.id}]`, answer);
      }
    });

    submitEnrollment(formData, {
      onSuccess: res => {
        const paymentUrl = res?.data?.payment_url;
        if (res?.data?.site_type === "paid") {
          window.location.href = paymentUrl;
        } else {
          router.push(`/enroll/registration-confirmed?type=${"free"}`);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex gap-6">
        <div className="flex-1 animate-pulse space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="w-72 animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-zinc-700">
          Class Enrollment
        </h1>

        {step === 1 && (
          <StepCourseOptions
            form={form}
            classDetails={classDetails}
            addonsList={addonsList}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepStudentInfo
            form={form}
            classDetails={classDetails}
            siteSettings={siteSettings}
            registrationQuestions={registrationQuestions}
            countryData={countryData}
            countryDataLoading={countryDataLoading}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepReviewPayment
            form={form}
            classDetails={classDetails}
            addonsList={addonsList}
            registrationQuestions={registrationQuestions}
            onBack={() => setStep(2)}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* ── Sidebar ── */}
      <div className="w-full lg:w-72 shrink-0">
        <EnrollSidebar siteSettings={siteSettings} />
      </div>
    </div>
  );
};

export default Page;
