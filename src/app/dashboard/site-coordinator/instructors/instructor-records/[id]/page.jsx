// src/app/dashboard/super-admin/instructors/instructor-records/[id]/page.jsx
import InstructorEditPage from "@/components/dashboard/instructor/InstructorEditPage";
import React from "react";

const Page = ({ params }) => {
  const { id } = params;
  return (
    <div>
      <InstructorEditPage id={id} />
    </div>
  );
};

export default Page;
