// src/app/dashboard/super-admin/[ts]/clients/manage-clients/[id]/page.jsx
"use client";

import { use } from "react";
import EditClientPage from "@/components/dashboard/clients/EditClientPage";

export default function Page({ params }) {
  const { id } = use(params);
  return <EditClientPage id={id} />;
}
