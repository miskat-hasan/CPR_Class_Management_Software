// src/components/dashboard/instructors/InstructorEditPage.jsx
"use client";
import InstructorForm from "@/components/dashboard/instructor/InstructorForm";
import CertificationsList from "@/components/dashboard/instructor/CertificationsList";
import UserDocumentsSection from "../settings/documents/UserDocumentsSection";
import { useGetSingleUser } from "@/hooks/api/dashboardApi";

const InstructorEditPage = ({ id }) => {
  const { data: instructorData, isLoading } = useGetSingleUser(id);
  console.log(instructorData?.data?.instructor_id);
  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      <InstructorForm
        mode="edit"
        id={id}
        instructorData={instructorData}
        isLoading={isLoading}
      />

      <CertificationsList
        instructorId={instructorData?.data?.instructor_id}
        isLoading={isLoading}
      />

      <UserDocumentsSection userId={id} title={"Instructor Documents"} />
    </div>
  );
};

export default InstructorEditPage;
