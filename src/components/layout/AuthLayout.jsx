// // src/components/dashboard/layout/AuthLayout.jsx
// "use client";

// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import useAuth from "@/hooks/useAuth";
// import { roleSegment, roleDefaultPage } from "@/config";
// import SelectRoleSkeleton from "@/components/skeleton/SelectRoleSkeleton";

// export default function AuthLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { hydrated, token, user, loading, activeRole, accessibleSites } =
//     useAuth();

//   useEffect(() => {
//     if (!hydrated || !token || !user || loading || !activeRole) return;

//     const isAuthPage = !pathname.startsWith("/dashboard");
//     if (!isAuthPage) return;

//     const segment = roleSegment[activeRole?.role_name];
//     const page = roleDefaultPage[activeRole?.role_name];
//     const firstTs =
//       accessibleSites?.[0]?.training_site_id ?? activeRole?.training_site_id;

//     if (!segment || !page) return;

//     const path =
//       segment === "student" || segment === "client"
//         ? `/dashboard/${segment}/${page}`
//         : `/dashboard/${segment}/${firstTs}/${page}`;

//     router.replace(path);
//   }, [hydrated, token, user, loading, activeRole, pathname, router]);

//   if (!hydrated || (token && (loading || !user))) return <SelectRoleSkeleton />;

//   return <>{children}</>;
// }


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
  const {
    hydrated,
    token,
    user,
    loading,
    activeRole,
    siteRoles,
    accessibleSites,
  } = useAuth();

  useEffect(() => {
    if (!hydrated || !token || !user || loading) return;

    const isAuthPage = !pathname.startsWith("/dashboard");
    if (!isAuthPage) return;

    // Authenticated, but this account has no training site at all — send
    // them to the notice page instead of leaving them stuck on /login or
    // falling through to the role-redirect logic below with a null activeRole.
    if (siteRoles.length === 0) {
      if (pathname !== "/no-training-site") {
        router.replace("/no-training-site");
      }
      return;
    }

    if (!activeRole) return;

    const segment = roleSegment[activeRole?.role_name];
    const page = roleDefaultPage[activeRole?.role_name];
    const firstTs =
      accessibleSites?.[0]?.training_site_id ?? activeRole?.training_site_id;

    if (!segment || !page) return;

    const path = `/dashboard/${segment}/${page}`;

    router.replace(path);
  }, [
    hydrated,
    token,
    user,
    loading,
    activeRole,
    siteRoles,
    accessibleSites,
    pathname,
    router,
  ]);

  if (!hydrated || (token && (loading || !user))) return <SelectRoleSkeleton />;

  return <>{children}</>;
}