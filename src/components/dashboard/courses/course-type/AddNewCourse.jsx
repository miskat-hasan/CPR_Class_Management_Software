"use client";

import SectionTitle from "@/components/common/SectionTitle";
import CourseForm from "@/components/dashboard/courses/course-type/CourseForm";
import { storeCourse } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function AddNewCourse() {
  const router = useRouter();
  const { ts } = useParams();
  const { selectedTrainingSiteId } = useAuth();

  const { mutate, isPending } = storeCourse();

  const onSubmit = (payload, isFormData) => {
    // Attach training_site_id
    if (isFormData) {
      payload.append("training_site_id", selectedTrainingSiteId);
    } else {
      payload.training_site_id = selectedTrainingSiteId;
    }

    mutate(isFormData ? payload : { data: payload }, {
      onSuccess: res => {
        toast.success(res?.message || "Course created successfully");
        router.push(`/dashboard/super-admin/${ts}/settings/course_type`);
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add Course Type" />
      <div className="bg-white dark:bg-black rounded-[14px] p-[13px] lg:p-[26px]">
        <CourseForm onSubmit={onSubmit} isPending={isPending} />
      </div>
    </section>
  );
}
