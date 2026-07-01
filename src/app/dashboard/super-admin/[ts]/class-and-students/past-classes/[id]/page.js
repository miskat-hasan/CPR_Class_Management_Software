// src/app/dashboard/super-admin/[ts]/class-and-students/past-classes/[id]/page.js
"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import ClassForm from "@/components/dashboard/class/ClassForm";
import { getSingleClass, updateClass } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import StudentRoster from "@/components/dashboard/student-roster/StudentRoster";
import SubSectionTitle from "@/components/common/SubSectionTitle";

export default function EditPastClassPage() {
  const { id, ts } = useParams();
  const router = useRouter();
  const { selectedTrainingSiteId } = useAuth();

  const { data, isLoading } = getSingleClass(id);
  const { mutate, isPending } = updateClass(id);

  const classData = data?.data;

  const defaultValues = useMemo(() => {
    if (!classData) return null;
    return {
      certifyingBodyId: String(
        classData.course?.course_certifying_body_id ?? "",
      ),
      certifyingBody: classData.course?.course_certifying_body ?? "",
      course: String(classData.course_id ?? ""),
      client: String(classData.client_id ?? ""),
      location: String(classData.location_id ?? ""),
      instructor: String(classData.instructor_id ?? ""),
      assistants: (classData.assistants ?? []).map(a => a.id ?? a),
      price: String(classData.price ?? ""),
      totalHours: String(classData.total_hours ?? ""),
      maxStudents: String(classData.max_student ?? ""),
      studentManikinRatio: classData.ratio ?? "",
      closeRegistrationDays: String(classData.close_registration_days ?? ""),
      closeRegistrationHours: String(classData.close_registration_hours ?? ""),
      listing: !!classData.listing,
      publicNotes: classData.public_notes ?? "",
      internalNotes: classData.internal_notes ?? "",
      adminNotes: classData.admin_notes ?? "",
      certificateIssued: classData.certificate_issued ?? "",
      certificateExpire: classData.certificate_expire ?? "",
      existingDocuments: classData.documents ?? [],
      signature: classData.signature ?? "",
      classTimes: (classData.class_times ?? []).map(ct => ({
        date: ct.date ?? "",
        timeFrom: ct.from ?? "",
        timeTo: ct.to ?? "",
      })),
    };
  }, [classData]);

  const onSubmit = formData => {
    formData.append("training_site_id", selectedTrainingSiteId);
    mutate(formData, {
      onSuccess: res => {
        toast.success(res?.message || "Class updated successfully");
        router.push(
          `/dashboard/super-admin/${ts}/class-and-students/past-classes`,
        );
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="Edit Class" />
        <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-brown rounded-full animate-spin" />
            <span className="text-sm">Loading class data…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-[10px] lg:gap-[20px]">
      <SectionTitle title={classData?.course_name} />
      <StudentRoster id={id} />
      <SubSectionTitle subtitle="Course Details" />
      <div className="bg-white dark:bg-black p-4 lg:p-6 rounded-[14px] shadow">
        <ClassForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isPending={isPending}
          isEdit={true}
          isPastClass={true}
        />
      </div>
    </div>
  );
}
