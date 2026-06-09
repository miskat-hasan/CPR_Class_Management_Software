"use client";

import { Logo } from "@/components/svg/SvgContainer";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import OTPInput from "react-otp-input";
import FormContainer from "../shared/form/FormContainer";
import { Button } from "../ui/button";

const ForgetPassword = ({ slug }) => {
  const form = useForm();
  const {
    control,
    formState: { errors },
  } = form;

  const router = useRouter();
  const [counter, setCounter] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  const onSubmit = (data) => {
    console.log("OTP submitted:", data.otp);
    // router.push(`/auth/forget_password/${slug}/create_password`);
  };

  const handleResend = () => {
    if (counter === 0) {
      setIsResending(true);

      setTimeout(() => {
        console.log("OTP resent");
        setCounter(60);
        setIsResending(false);
      }, 1500);
    }
  };

  const decodedEmail = Buffer.from(slug, "base64").toString("utf-8");
  console.log(decodedEmail)

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col bg-white dark:bg-black w-full max-w-[600px] p-5 rounded-2xl border border-gray-100 dark:border-neutral-700">
        <div className="  flex flex-col justify-center items-center   ">
          <div className="flex items-center gap-1.5 justify-center">
            <Logo />
            <h5 className="font-black text-[14px]">ENROLL NATIONWIDE</h5>
          </div>
          <h3 className="text-2xl md:text-4xl mt-2">Enter OTP Code</h3>
          <p className="text-xs md:text-base mt-2 md:mt-5 text-center">
            Your verification code is on its way! Check your inbox and enter the
            code below to reset your password.
          </p>
        </div>

        <FormContainer form={form} onSubmit={onSubmit}>
          <div className=" flex flex-col gap-[10px] mt-5 mb-5">
            <label htmlFor="otp">Enter the code</label>
            <Controller
              name="otp"
              control={control}
              rules={{
                required: "OTP is required",
                minLength: { value: 6, message: "OTP must be 6 digits" },
              }}
              render={({ field }) => (
                <>
                  <OTPInput
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    numInputs={6}
                    renderInput={(props) => <input {...props} />}
                    containerStyle="flex items-center justify-center gap-4 md:gap-6 flex-wrap"
                    inputStyle="!w-[55px] !h-[55px] md:!w-[64px] md:!h-[64px] border !border-gray-200  rounded-full text-lg md:text-xl lg:text-3xl font-medium focus:outline focus:outline-light-blue"
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.otp.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <Button
            type="submit"
            className="px-6 h-[40px] border border-brown rounded-md shadow-sm text-sm font-medium cursor-pointer text-white hover:text-brown bg-brown dark:bg-dark-brown hover:bg-transparent w-full duration-300"
          >
            Submit
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default ForgetPassword;
