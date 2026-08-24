// src/components/auth/SiteInactiveClient.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function SiteInactiveClient() {
  const router = useRouter();
  const { hydrated, token, user, clearToken, isSiteActive } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/login");
  }, [hydrated, token, router]);

  useEffect(() => {
    if (!hydrated || !token) return;
    if (isSiteActive) {
      router.replace("/dashboard");
    }
  }, [hydrated, token, isSiteActive, router]);

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  if (!hydrated || !token) return null;

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-5 bg-gray-50 dark:bg-dark px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      </div>

      <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
        Site Not Active
      </h1>

      <p className="max-w-md text-sm text-gray-500 dark:text-[#a7a19c]">
        Hi {user?.name || "there"} — the training site you are currently
        associated with is not active. Please contact the Training Center Admin
        to resolve this issue.
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
