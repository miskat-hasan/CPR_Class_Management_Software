// src/app/dashboard/super-admin/[ts]/instructors/instructor-records/[id]/page.jsx
"use client";
import InstructorForm from "@/components/dashboard/instructors/InstructorForm";
import DocumentList from "@/components/dashboard/instructors/DocumentList";
import { getSingleInstructor } from "@/hooks/api/dashboardApi";
import CertificationsList from "@/components/dashboard/instructors/CertificationsList";

const Page = ({ params }) => {
  const { id } = params;
  const { data: instructorData, isLoading } = getSingleInstructor(id);

  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      <InstructorForm mode="edit" instructorId={id} />

      <DocumentList
        instructorId={instructorData?.data?.id}
        documentData={instructorData?.data?.documents}
        isLoading={isLoading}
      />

      <CertificationsList
        instructorId={instructorData?.data?.id}
        CertificationData={instructorData?.data?.certifications}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Page;
