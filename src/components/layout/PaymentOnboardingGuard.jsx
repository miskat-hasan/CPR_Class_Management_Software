// src/components/layout/PaymentOnboardingGuard.jsx
"use client";

import useAuth from "@/hooks/useAuth";
import { useCheckPaymentStatus } from "@/hooks/api/dashboardApi";
import AuthorizeNetConnectForm from "@/components/dashboard/settings/payment-account/AuthorizeNetConnectForm";

export default function PaymentOnboardingGuard({ children }) {
  const { activeRole, user } = useAuth();

  const isSiteCoordinator = activeRole?.role_name === "Site Coordinator";
  const userId = user?.id;
  const siteId = activeRole?.training_site_id;

  // Only fetch when it's actually relevant — no point hitting this endpoint
  // for roles the guard doesn't apply to.
  const {
    data: statusData,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useCheckPaymentStatus(
    isSiteCoordinator ? userId : undefined,
    isSiteCoordinator ? siteId : undefined,
  );

  if (!isSiteCoordinator) {
    return <>{children}</>;
  }

  // While the live status is loading, don't flash the connect screen —
  // wait for a real answer instead of trusting the (possibly stale) login flags.
  if (statusLoading) {
    return null; // or a spinner, if you have a standard one for this
  }

  const siteType = statusData?.data?.site_type;
  const isConnected = statusData?.data?.is_connected ?? false;

  // Free sites don't need payment onboarding
  if (siteType === "free") {
    return <>{children}</>;
  }

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1e2021] flex items-center justify-center p-6">
      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brown/5 dark:bg-dark-brown/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-brown/8 dark:bg-dark-brown/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white dark:bg-[#181a1b] rounded-[20px] shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-brown via-dark-brown to-brown" />

          <div className="p-8 sm:p-10">
            <AuthorizeNetConnectForm
              siteId={siteId}
              siteName={activeRole?.training_site_name}
              onConnected={() => refetchStatus()}
            />

            <p className="mt-4 text-center text-[12px] text-gray-400 dark:text-gray-600">
              Powered by Authorize.net · Secure payment processing
            </p>
          </div>
        </div>

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
