// src/components/dashboard/layout/DashboardGuard.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import SidebarSkeleton from "@/components/skeleton/SidebarSkeleton";

export default function DashboardGuard({ children }) {
  const router = useRouter();
  const { hydrated, token, user, loading } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (loading) return;

    if (!token) {
      router.replace("/login");
      return;
    }
  }, [hydrated, token, loading, router]);

  if (!hydrated || loading || (token && !user)) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarSkeleton />
        <div className="flex flex-1 flex-col min-w-0">
          <div className="h-16 border-b border-gray-100 dark:border-neutral-700 bg-white dark:bg-black px-6 flex items-center gap-4">
            <div className="h-4 w-48 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse" />
            <div className="ml-auto h-8 w-8 rounded-full bg-gray-200 dark:bg-neutral-700 animate-pulse" />
          </div>
          <div className="flex-1 px-6 py-10 flex flex-col gap-4">
            <div className="h-6 w-48 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
