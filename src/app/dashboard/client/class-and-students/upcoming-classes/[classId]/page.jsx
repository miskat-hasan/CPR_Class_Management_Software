// src/app/dashboard/client/class-and-students/upcoming-classes/[classId]/page.js
"use client";

import { useParams } from "next/navigation";
import ClientClassDetailsPage from "@/components/dashboard/class-and-students/ClientClassDetailsPage";

export default function Page() {
  const { classId } = useParams();
  return <ClientClassDetailsPage classId={classId} />;
}
