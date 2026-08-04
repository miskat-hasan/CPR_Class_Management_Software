// src/components/dashboard/layout/AuthLayout.jsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { roleSegment, roleDefaultPage } from "@/config";
import SelectRoleSkeleton from "@/components/skeleton/SelectRoleSkeleton";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, token, user, loading, activeRole, accessibleSites } =
    useAuth();

  useEffect(() => {
    if (!hydrated || !token || !user || loading || !activeRole) return;

    const isAuthPage = !pathname.startsWith("/dashboard");
    if (!isAuthPage) return;

    const segment = roleSegment[activeRole?.role_name];
    const page = roleDefaultPage[activeRole?.role_name];
    const firstTs =
      accessibleSites?.[0]?.training_site_id ?? activeRole?.training_site_id;

    if (!segment || !page) return;

    const path =
      segment === "student" || segment === "client"
        ? `/dashboard/${segment}/${page}`
        : `/dashboard/${segment}/${firstTs}/${page}`;

    router.replace(path);
  }, [hydrated, token, user, loading, activeRole, pathname, router]);

  if (!hydrated || (token && (loading || !user))) return <SelectRoleSkeleton />;

  return <>{children}</>;
}
