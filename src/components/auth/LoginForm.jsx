"use client";

import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/api/authApi";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Logo } from "../svg/SvgContainer";

function NavigatingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-1.5">
        <Logo />
        <h5 className="font-black text-[14px]">ENROLL NATIONWIDE</h5>
      </div>
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <div className="h-4 w-4 rounded-full border-2 border-brown border-t-transparent animate-spin" />
        <span>Signing you in...</span>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const [navigating, setNavigating] = useState(false);
  const { mutateAsync: loginMutation, isPending } = useLogin({ setNavigating });

  const form = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    await loginMutation(values);
  };

  if (navigating) return <NavigatingOverlay />;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-black max-w-[600px] w-full p-5 rounded-2xl border border-gray-100 dark:border-neutral-700">
        <div className="flex items-center gap-1.5 justify-center">
          <Logo />
          <h5 className="font-black text-[14px]">ENROLL NATIONWIDE</h5>
        </div>

        <p className="text-center mt-2 text-[20px]">
          <span className="font-semibold dark:text-[#E2DFDB]">Welcome back!</span>
          <br />
          <span className="text-[16px] text-gray-500 dark:text-[#a7a19c]">
            Sign in to access your account
          </span>
        </p>

        <FormContainer form={form} onSubmit={onSubmit}>
          <FormInput
            name="email"
            label="Email"
            placeholder="Enter Your Email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
          />
          <FormInput
            name="password"
            label="Password"
            placeholder="Enter Your Password"
            type="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />

          <Link
            href="/forget-password"
            className="mb-2 inline-block text-brown underline dark:text-red-500 text-sm dark:hover:text-brown duration-300"
          >
            Forget Password?
          </Link>

          <Button
            type="submit"
            disabled={isPending}
            className="px-6 h-[40px] border border-brown rounded-md shadow-sm text-sm font-medium cursor-pointer text-white hover:text-brown dark:hover:text-red-500 bg-brown dark:bg-dark-brown dark:hover:bg-transparent hover:bg-transparent w-full duration-300 disabled:cursor-not-allowed"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </FormContainer>
      </div>
    </div>
  );
}