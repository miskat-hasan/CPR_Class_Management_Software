// src/components/dashboard/settings/payment-account/AuthorizeNetConnectForm.jsx
"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AlertCircle, CreditCard } from "lucide-react";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { useSavePaymentCredentials } from "@/hooks/api/dashboardApi";

// Renders just the card contents (no outer page/dialog chrome) so it can be
// dropped into a Dialog on the settings page or directly into the full-page guard.
const AuthorizeNetConnectForm = ({ siteId, siteName, onConnected }) => {
  const form = useForm({
    defaultValues: {
      authorize_login_id: "",
      authorize_transaction_key: "",
    },
  });
  const { reset } = form;

  const { mutate, isPending, error } = useSavePaymentCredentials();

  const onSubmit = data => {
    const formData = new FormData();
    formData.append("site_id", siteId);
    formData.append("authorize_login_id", data.authorize_login_id);
    formData.append(
      "authorize_transaction_key",
      data.authorize_transaction_key,
    );

    mutate(formData, {
      onSuccess: res => {
        toast.success(
          res?.message || "Payment gateway account connected successfully!",
        );
        reset();
        onConnected?.(res?.data);
      },
      // no toast.error here — the inline banner below already shows it
    });
  };

  const errorMessage = error?.response?.data?.message;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-brown/10 dark:bg-dark-brown/20 text-brown dark:text-dark-brown uppercase">
            Payment Gateway Setup
          </span>
          <h2 className="mt-2 text-xl font-bold text-[#181a1b] dark:text-white">
            Connect Authorize.Net
          </h2>
          {siteName && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {siteName} Merchant Onboarding
            </p>
          )}
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brown/10 dark:bg-dark-brown/20 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-brown dark:text-dark-brown" />
        </div>
      </div>

      <div className="rounded-[10px] bg-brown/5 dark:bg-dark-brown/10 border border-brown/10 dark:border-dark-brown/20 p-4 text-sm text-gray-700 dark:text-gray-300">
        <p className="font-semibold text-[#181a1b] dark:text-white mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-brown dark:text-dark-brown" />
          Setup Instructions:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-[13px]">
          <li>
            Log into your{" "}
            <a
              href="https://account.authorize.net/"
              target="_blank"
              rel="noreferrer"
              className="text-brown dark:text-dark-brown underline"
            >
              Authorize.net Merchant Portal
            </a>
          </li>
          <li>
            Navigate to{" "}
            <strong>Account → Settings → API Credentials & Keys</strong>
          </li>
          <li>
            Copy your <strong>API Login ID</strong> and{" "}
            <strong>Transaction Key</strong> below
          </li>
          <li>
            Don&apos;t have an account?{" "}
            <a
              href="https://www.authorize.net/sign-up.html"
              target="_blank"
              rel="noreferrer"
              className="text-brown dark:text-dark-brown underline"
            >
              Create Authorize.net Account
            </a>
          </li>
        </ol>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-[10px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      <FormContainer form={form} onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <FormInput
            name="authorize_login_id"
            label="API Login ID"
            placeholder="e.g. 5KP80..."
            rules={{ required: "API Login ID is required" }}
          />
          <FormInput
            name="authorize_transaction_key"
            label="Transaction Key"
            type="password"
            placeholder="Transaction key"
            rules={{ required: "Transaction key is required" }}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 py-3 text-sm font-semibold rounded-[10px] bg-brown dark:bg-dark-brown hover:bg-brown-hover text-white cursor-pointer disabled:opacity-60"
        >
          {isPending ? "Verifying..." : "Verify & Connect Account"}
        </Button>
      </FormContainer>
    </div>
  );
};

export default AuthorizeNetConnectForm;
