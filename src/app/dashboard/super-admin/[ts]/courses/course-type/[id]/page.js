"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import CourseForm from "@/components/dashboard/courses/course-type/CourseForm";
import { getSingleCourse, updateCourse } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";

export default function EditCoursePage() {
  const { id, ts } = useParams();
  const router = useRouter();
  const { selectedTrainingSiteId } = useAuth();

  const { data: courseData, isLoading } = getSingleCourse(id);
  const { mutate, isPending } = updateCourse();

  const course = courseData?.data;

  // Map API response → form shape
  const defaultValues = course
    ? {
        course_name: course.course_name ?? "",
        mode: course.mode === "onsite" ? "on-site" : (course.mode ?? "on-site"),
        discipline: String(course.discipline ?? ""),
        deposit_registration: !!course.allow_deposit,
        deposit_amounts: String(course.deposit_amount ?? ""),
        multiple_pricing: !!course.allow_multiple,
        price: String(course.price ?? ""),
        price_level_prompt: course.deposits?.[0]?.price_level_prompt ?? "",
        priceLevel:
          course.allow_multiple && course.deposits?.length
            ? course.deposits.map(d => ({
                price: String(d.price_levels?.price ?? ""),
                code: d.price_levels?.code ?? "",
                description: d.price_levels?.description ?? "",
              }))
            : [
                { price: "", code: "", description: "" },
                { price: "", code: "", description: "" },
              ],
        addonPrompt: course.prompt ?? "",
        add_ons: (course.addons ?? []).map(a => Number(a.id)),
        shipping_price: String(course.shipping_price ?? ""),
        keycode_bank: String(course.keycode_bank_id ?? ""),
        course_certifying_body:
          course.course_certifying_body === "american_red_cross"
            ? "American Red Cross"
            : course.course_certifying_body === "american_heart_association"
              ? "American Heart Association"
              : "none",
        courseSKUs: course.course_skus ?? "",
        cardType: String(course.card_type_id ?? ""),
        secondCardType: String(course.second_card_type_id ?? ""),
        course_image: String(course.course_image_id ?? ""),
        upload_image: null,
        options: course.options ?? {},
        ceu_credits: course.ecu_credits ?? "",
        courseConfirmationEmailCCS: Array.isArray(course.confirmation_email)
          ? course.confirmation_email.join(", ")
          : (course.confirmation_email ?? ""),
        courseConfirmationEmailSubject:
          course.course_confirmation_email_subject ?? "",
        payloadConfirmationEmailSubject:
          course.payment_confirmation_email_subject ?? "",
        use_email_for_payments: !!course.use_general_email_body,
        enable_seo: !!course.seo_rich_results,
        seoDescription: course.seo_description ?? "",
        description: course.description ?? "",
        email_body: course.email_body ?? "",
      }
    : null;

  const onSubmit = (payload, isFormData) => {
    if (isFormData) {
      payload.append("id", id);
      payload.append("training_site_id", selectedTrainingSiteId);
    } else {
      payload.id = Number(id);
      payload.training_site_id = selectedTrainingSiteId;
    }

    mutate(isFormData ? payload : { data: payload }, {
      onSuccess: res => {
        toast.success(res?.message || "Course updated successfully");
        router.push(`/dashboard/super-admin/${ts}/settings/course_type`);
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  if (isLoading) return null;

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Edit Course Type" />
      <div className="bg-white dark:bg-black rounded-[14px] p-[13px] lg:p-[26px]">
        <CourseForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isPending={isPending}
          isEdit={true}
        />
      </div>
    </section>
  );
}
