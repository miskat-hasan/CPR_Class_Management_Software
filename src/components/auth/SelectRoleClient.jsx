"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { roleSegment, roleDefaultPage } from "@/config";
import Cookies from "js-cookie";

export default function SelectRoleClient() {
  const router = useRouter();
  const { hydrated, token, siteRoles, setActiveRole } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/login");
  }, [hydrated, token, router]);

  const handleRoleSelect = (siteRole) => {
    setActiveRole(siteRole);

    const accessibleSites = siteRoles
      .filter((sr) => sr.role_name === siteRole.role_name)
      .map((sr) => sr.training_site_id)
      .join(",");

    Cookies.set("role", siteRole.role_name, { sameSite: "strict" });
    Cookies.set("allowed_sites", accessibleSites, { sameSite: "strict" });

    const segment = roleSegment[siteRole.role_name];
    const page = roleDefaultPage[siteRole.role_name];
    const isNoSite = segment === "student" || segment === "client";

    const path = isNoSite
      ? `/dashboard/${segment}/${page}`
      : `/dashboard/${segment}/${siteRole.training_site_id}/${page}`;

    router.push(path);
  };

  if (!hydrated) return null;
  if (!token) return null;

  const uniqueRoles = siteRoles.reduce((acc, sr) => {
    if (!acc.find((r) => r.role_name === sr.role_name)) acc.push(sr);
    return acc;
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-gray-50 dark:bg-dark">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Select a Role</h1>
      <p className="text-gray-500 text-sm dark:text-[#a7a19c]">
        You have access to multiple roles. Choose how you want to continue.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {uniqueRoles.map((siteRole) => {
          const siteCount = siteRoles.filter(
            (sr) => sr.role_name === siteRole.role_name,
          ).length;

          return (
            <button
              key={siteRole.role_id}
              onClick={() => handleRoleSelect(siteRole)}
              className="w-full px-6 cursor-pointer py-4 bg-white dark:bg-black border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm hover:border-brown dark:hover:border-border dark:hover:shadow-lg hover:shadow-md transition-all text-left"
            >
              <p className="font-semibold text-gray-800 dark:text-white">
                {siteRole.role_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-[#a7a19c]">
                {siteCount} training site{siteCount > 1 ? "s" : ""}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
