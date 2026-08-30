"use client";
// src/app/dashboard/super-admin/instructors/instructor-records/[id]/page.jsx
import InstructorEditPage from "@/components/dashboard/instructor/InstructorEditPage";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { id } = useParams();
  return (
    <div>
      <InstructorEditPage id={id} />
    </div>
  );
};

export default Page;
