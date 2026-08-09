// src/components/layout/PaymentOnboardingGuard.jsx
"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useCreatePaymentOnboarding } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";

export default function PaymentOnboardingGuard({ children }) {
  const { activeRole, user } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { mutate: createOnboarding, isPending } = useCreatePaymentOnboarding();

  // Only enforce for Site Coordinator whose payment is not set up
  const needsPaymentSetup =
    activeRole?.role_name === "Site Coordinator" &&
    activeRole?.needs_payment_setup === true &&
    activeRole?.is_authorize_connected === false;

  if (!needsPaymentSetup) {
    return <>{children}</>;
  }

  const handleConnect = () => {
    if (!user?.id || !activeRole?.training_site_id) {
      toast.error("Unable to initiate payment setup. Please try again.");
      return;
    }

    createOnboarding(
      { user_id: user.id, site_id: activeRole.training_site_id },
      {
        onSuccess: (data) => {
          const onboardingUrl = data?.data?.onboarding_url;
          if (onboardingUrl) {
            setIsRedirecting(true);
            window.location.href = onboardingUrl;
          } else {
            toast.error("Failed to retrieve onboarding URL.");
          }
        },
      }
    );
  };

  const loading = isPending || isRedirecting;

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1e2021] flex items-center justify-center p-6">
      {/* Background decorative blobs */}
      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#b70000]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#b70000]/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div className="bg-white dark:bg-[#181a1b] rounded-[20px] shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">

          {/* Top accent strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#b70000] via-[#e05050] to-[#b70000]" />

          <div className="p-8 sm:p-10">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-[72px] h-[72px] rounded-2xl bg-[#b70000]/10 dark:bg-[#b70000]/15 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-9 h-9 text-[#b70000]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-2">
              <h1 className="text-[22px] font-bold text-[#181a1b] dark:text-white leading-snug">
                Payment Account Required
              </h1>
              <p className="mt-2 text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                To start accepting payments at{" "}
                <span className="font-semibold text-[#181a1b] dark:text-white">
                  {activeRole?.training_site_name || "your training site"}
                </span>
                , you need to connect your Authorize.net payment account.
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-100 dark:border-gray-800" />

            {/* Info bullets */}
            <ul className="space-y-3 mb-8">
              {[
                "Securely accept card payments from students",
                "Funds are deposited directly to your account",
                "Takes only a few minutes to complete",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#b70000]/10 dark:bg-[#b70000]/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-[#b70000]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-[13px] text-gray-600 dark:text-gray-400">{text}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              id="btn-connect-payment"
              type="button"
              onClick={handleConnect}
              disabled={loading}
              className="w-full py-3.5 rounded-[12px] bg-[#b70000] hover:bg-[#920000] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[15px] transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-[#b70000]/25 hover:shadow-[#b70000]/40 hover:shadow-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isRedirecting ? "Redirecting..." : "Setting up..."}
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Connect Payment Account
                </>
              )}
            </button>

            {/* Footer note */}
            <p className="mt-4 text-center text-[12px] text-gray-400 dark:text-gray-600">
              Powered by Authorize.net · Secure payment processing
            </p>
          </div>
        </div>

        {/* Site name badge */}
        <p className="mt-5 text-center text-[12px] text-gray-400 dark:text-gray-600">
          Logged in as{" "}
          <span className="font-medium text-gray-500 dark:text-gray-500">
            {activeRole?.role_name}
          </span>{" "}
          ·{" "}
          <span className="font-medium text-gray-500 dark:text-gray-500">
            {activeRole?.training_site_name}
          </span>
        </p>
      </div>
    </div>
  );
}
