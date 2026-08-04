// src/app/dashboard/student/classes/upcoming-classes/[classId]/page.js
"use client";

import ClassDetailsPage from "@/components/dashboard/class-and-students/ClassDetailsPage";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { classId } = useParams();

  return (
    <div>
      <ClassDetailsPage classId={classId} />
    </div>
  );
};

export default Page;
