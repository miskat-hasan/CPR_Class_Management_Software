// src/components/auth/NoTrainingSiteClient.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function NoTrainingSiteClient() {
  const router = useRouter();
  const { hydrated, token, user, clearToken } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/login");
  }, [hydrated, token, router]);

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  if (!hydrated || !token) return null;

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-5 bg-gray-50 dark:bg-dark px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-amber-600 dark:text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
        No Training Site Assigned
      </h1>

      <p className="max-w-md text-sm text-gray-500 dark:text-[#a7a19c]">
        Hi {user?.name || "there"} — your account isn&apos;t currently assigned
        to a training site, so there&apos;s nothing to show yet. Once an
        administrator assigns you to a site, log in again to continue.
      </p>

      <button
        onClick={handleLogout}
        className="px-6 py-2.5 bg-brown dark:bg-dark-brown text-white text-sm font-medium rounded-md hover:opacity-90 cursor-pointer"
      >
        Log Out
      </button>
    </div>
  );
}
