"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import ClassForm from "@/components/dashboard/class/ClassForm";
import { getSingleClass, updateClass } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import StudentRoster from "@/components/dashboard/student_roster/StudentRoster";

export default function EditUpcomingClassPage() {
  const { id, ts } = useParams();
  const router = useRouter();
  const { selectedTrainingSiteId } = useAuth();

  const { data, isLoading } = getSingleClass(id);
  const { mutate, isPending } = updateClass(id);

  const classData = data?.data;

  const defaultValues = classData
    ? {
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
        closeRegistrationHours: String(
          classData.close_registration_hours ?? "",
        ),
        listing: !!classData.listing,
        publicNotes: classData.public_notes ?? "",
        internalNotes: classData.internal_notes ?? "",
        adminNotes: classData.admin_notes ?? "",
        certificateIssued: classData.certificate_issued ?? "",
        certificateExpire: classData.certificate_expire ?? "",
        existingDocuments: classData.documents ?? [],
        classTimes: (classData.class_times ?? []).map(ct => ({
          date: ct.date ?? "",
          timeFrom: ct.from ?? "",
          timeTo: ct.to ?? "",
        })),
      }
    : null;

  const onSubmit = formData => {
    formData.append("training_site_id", selectedTrainingSiteId);
    mutate(formData, {
      onSuccess: res => {
        toast.success(res?.message || "Class updated successfully");
        router.push(
          `/dashboard/super-admin/${ts}/class-and-students/upcoming-classes`,
        );
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  if (isLoading) return null;

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
        />
      </div>
    </div>
  );
}
