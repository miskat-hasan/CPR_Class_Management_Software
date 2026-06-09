"use client";

import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/hooks/api/authApi";
import { Logo } from "@/components/svg/SvgContainer";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ResetPassword = ({ params }) => {
  const { slug } = use(params);

  const router = useRouter();

  const decodedData = Buffer.from(slug, "base64").toString("utf-8");
  const decodedEmail = decodedData.split(".com")[0];
  const decodedToken = decodedData.split(".com")[1];

  // reset password mutation
  const { mutate, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data) => {
    const payload = {
      email: decodedEmail + ".com",
      token: decodedToken,
      ...data,
    };
    mutate(payload, {
      onSuccess: (data) => {
        if (data?.status) {
          Swal.fire({
            title: data?.message || "Password Reset Successful",
            icon: "success",
            confirmButtonText: "Login",
            allowOutsideClick: false,
          }).then(() => {
            router.push("/login");
          });
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-black max-w-[600px] w-full p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
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

          <FormInput
            name="password_confirmation"
            label="Confirm Password"
            placeholder="Enter Your Password"
            type="password"
            rules={{
              required: "Confirm Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="px-6 h-[40px] border border-brown rounded-md shadow-sm text-sm font-medium cursor-pointer text-white hover:text-brown dark:hover:text-red-500 bg-brown dark:bg-dark-brown dark:hover:bg-transparent hover:bg-transparent w-full duration-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Processing...." : "Reset Password"}
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default ResetPassword;
