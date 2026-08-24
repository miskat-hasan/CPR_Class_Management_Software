// src/components/enroll/RegistrationConfirmedContent.jsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const RegistrationConfirmedContent = () => {
  const searchParams = useSearchParams();

  // Backend isn't wired up yet — these will come through as query params
  // once the payment API redirects here (e.g. order id, confirmation #).
  const orderId = searchParams.get("order_id");
  const confirmationNumber = searchParams.get("confirmation_number");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[520px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-[14px] shadow-sm p-6 lg:p-10 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-xl lg:text-2xl font-semibold text-black dark:text-white">
          Registration Confirmed
        </h1>

        <p className="text-sm text-gray-600 dark:text-zinc-400">
          Thank you! Your payment was successful and your seat is reserved. A
          confirmation email with your class details is on its way to your
          inbox.
        </p>

        {(orderId || confirmationNumber) && (
          <div className="w-full bg-gray-50 dark:bg-zinc-800 rounded-md px-4 py-3 flex flex-col gap-1 text-sm text-gray-700 dark:text-zinc-300">
            {confirmationNumber && (
              <div>
                <span className="font-medium">Confirmation #:</span>{" "}
                {confirmationNumber}
              </div>
            )}
            {orderId && (
              <div>
                <span className="font-medium">Order ID:</span> {orderId}
              </div>
            )}
          </div>
        )}

        {/* Login credentials reminder */}
        <div className="w-full flex items-start gap-2.5 text-left text-sm bg-brown/5 dark:bg-dark-brown/10 border border-brown/15 dark:border-dark-brown/20 rounded-md px-4 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 flex-shrink-0 mt-0.5 text-brown dark:text-dark-brown"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            />
          </svg>
          <span className="text-gray-700 dark:text-zinc-300">
            You can now log in to your student dashboard using the username and
            password you created during registration to view your classes,
            certifications, and documents.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-brown dark:bg-dark-brown hover:opacity-90 text-white font-medium text-sm rounded-md transition-colors text-center"
          >
            Log In to My Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 bg-transparent border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 text-black dark:text-white font-medium text-sm rounded-md transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmedContent;
