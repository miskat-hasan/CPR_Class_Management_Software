// src/components/dashboard/settings/payment-account/PaymentAccountSettings.jsx
"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useCheckPaymentStatus } from "@/hooks/api/dashboardApi";
import SectionTitle from "@/components/common/SectionTitle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthorizeNetConnectForm from "./AuthorizeNetConnectForm";

const StatusBadge = ({ connected }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
      connected
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-red-100 text-[#b70000] dark:bg-[#b70000]/15 dark:text-red-400"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        connected ? "bg-green-500 dark:bg-green-400" : "bg-[#b70000]"
      }`}
    />
    {connected ? "Connected" : "Not Connected"}
  </span>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 px-4">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-[#181a1b] dark:text-white">
      {value}
    </span>
  </div>
);

const PaymentAccountSettings = () => {
  const { user, activeRole } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const userId = user?.id;
  const siteId = activeRole?.training_site_id;

  const {
    data: statusData,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useCheckPaymentStatus(userId, siteId);

  const paymentData = statusData?.data;
  const isConnected = paymentData?.is_connected ?? false;
  const gateway = paymentData?.gateway_name;

  const handleConnected = () => {
    refetchStatus();
    setDialogOpen(false);
  };

  return (
    <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <SectionTitle title="Payment Account" />

      <div className="bg-white dark:bg-black rounded-[14px] p-[13px] lg:p-[26px]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-[#181a1b] dark:text-white">
              Authorize.net Payment Integration
            </h2>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
              Connect your Authorize.net account to accept payments from
              students at{" "}
              <span className="font-medium text-[#181a1b] dark:text-white">
                {activeRole?.training_site_name}
              </span>
              .
            </p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brown/10 dark:bg-dark-brown/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-brown dark:text-dark-brown"
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

        {statusLoading ? (
          <div className="rounded-[10px] border border-gray-100 dark:border-gray-800 p-4 space-y-3 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-neutral-800 rounded" />
          </div>
        ) : (
          <div className="rounded-[10px] border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 mb-6">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Status
              </span>
              <StatusBadge connected={isConnected} />
            </div>
            <InfoRow
              label="Training Site"
              value={activeRole?.training_site_name || "—"}
            />
            {isConnected && gateway && (
              <InfoRow label="Payment Gateway" value={gateway} />
            )}
            <InfoRow label="Site ID" value={siteId || "—"} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button
                id={
                  isConnected
                    ? "btn-change-payment-account"
                    : "btn-connect-payment-account"
                }
                type="button"
                disabled={statusLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-brown dark:bg-dark-brown hover:bg-brown-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {isConnected ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  )}
                </svg>
                {isConnected
                  ? "Change Payment Account"
                  : "Connect Payment Account"}
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] bg-white dark:bg-black dark:border-gray-700">
              <DialogHeader className="sr-only">
                <DialogTitle>Connect Authorize.Net</DialogTitle>
              </DialogHeader>
              <AuthorizeNetConnectForm
                siteId={siteId}
                siteName={activeRole?.training_site_name}
                onConnected={handleConnected}
              />
            </DialogContent>
          </Dialog>
        </div>

        <p className="mt-5 text-[12px] text-gray-400 dark:text-gray-600">
          {isConnected
            ? "Changing your account will replace your existing Authorize.net connection."
            : "You'll need your Authorize.net API Login ID and Transaction Key to connect."}
        </p>
      </div>
    </section>
  );
};

export default PaymentAccountSettings;
