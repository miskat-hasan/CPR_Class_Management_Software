// src/components/auth/SelectRoleClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { roleSegment, roleDefaultPage } from "@/config";
import Cookies from "js-cookie";

export default function SelectRoleClient() {
  const router = useRouter();
  const { hydrated, token, siteRoles, setActiveRole } = useAuth();
  const [pendingRoleName, setPendingRoleName] = useState(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/login");
  }, [hydrated, token, router]);

  const finalizeSelection = siteRole => {
    setActiveRole(siteRole);

    const accessibleSites = siteRoles
      .filter(sr => sr.role_name === siteRole.role_name)
      .map(sr => sr.training_site_id)
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

  const handleRoleSelect = roleName => {
    const sitesForRole = siteRoles.filter(sr => sr.role_name === roleName);

    if (sitesForRole.length === 1) {
      // Only one site under this role — nothing to choose, go straight in.
      finalizeSelection(sitesForRole[0]);
    } else {
      // Multiple sites under the same role — let them pick which one.
      setPendingRoleName(roleName);
    }
  };

  if (!hydrated) return null;
  if (!token) return null;

  const uniqueRoleNames = [...new Set(siteRoles.map(sr => sr.role_name))];

  const sitesForPendingRole = pendingRoleName
    ? siteRoles.filter(sr => sr.role_name === pendingRoleName)
    : [];

  // ── Step 2: pick a training site within the chosen role ──
  if (pendingRoleName) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-gray-50 dark:bg-dark px-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Select a Training Site
        </h1>
        <p className="text-gray-500 text-sm dark:text-[#a7a19c] text-center">
          You have {sitesForPendingRole.length} training sites as{" "}
          <span className="font-semibold">{pendingRoleName}</span>. Choose which
          one to continue with.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          {sitesForPendingRole.map(siteRole => (
            <button
              key={siteRole.training_site_id}
              onClick={() => finalizeSelection(siteRole)}
              className="w-full px-6 cursor-pointer py-4 bg-white dark:bg-black border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm hover:border-brown dark:hover:border-border dark:hover:shadow-lg hover:shadow-md transition-all text-left"
            >
              <p className="font-semibold text-gray-800 dark:text-white">
                {siteRole.training_site_name}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setPendingRoleName(null)}
          className="text-sm text-gray-500 dark:text-[#a7a19c] underline cursor-pointer"
        >
          ← Back to role selection
        </button>
      </div>
    );
  }

  // ── Step 1: pick a role ──
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-gray-50 dark:bg-dark">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Select a Role
      </h1>
      <p className="text-gray-500 text-sm dark:text-[#a7a19c]">
        You have access to multiple roles. Choose how you want to continue.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {uniqueRoleNames.map(roleName => {
          const siteCount = siteRoles.filter(
            sr => sr.role_name === roleName,
          ).length;

          return (
            <button
              key={roleName}
              onClick={() => handleRoleSelect(roleName)}
              className="w-full px-6 cursor-pointer py-4 bg-white dark:bg-black border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm hover:border-brown dark:hover:border-border dark:hover:shadow-lg hover:shadow-md transition-all text-left"
            >
              <p className="font-semibold text-gray-800 dark:text-white">
                {roleName}
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
