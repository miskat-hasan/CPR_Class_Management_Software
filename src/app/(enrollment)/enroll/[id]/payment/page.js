"use client";

import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { usePaymentProcess } from "@/hooks/api/dashboardApi";
import { Logo } from "@/components/svg/SvgContainer";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { toast } from "sonner";

const PaymentPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const form = useForm({
    defaultValues: {
      card_number: "",
      expiry_date: "",
      cvv: "",
    },
    mode: "onChange",
  });

  const { reset } = form;
  const { mutate, isPending } = usePaymentProcess();

  const onSubmit = (data) => {
    const payload = {id: id, ...data}
    mutate(payload, {
      onSuccess: (res) => {
        reset();
        toast.success(res?.message || "Payment successful");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white dark:bg-black max-w-[500px] w-full p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1.5 justify-center mb-6">
          <Logo />
          <h5 className="font-black text-[14px]">ENROLL NATIONWIDE</h5>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
          <p className="text-[14px] text-gray-500">
            Complete the payment to enroll the course
          </p>
        </div>

        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="space-y-4">
            <FormInput
              name="card_number"
              label="Card Number"
              placeholder="1234 5678 1234 5678"
              rules={{
                required: "Card Number is required",
                // pattern: {
                //   value: /^\d{16}$/,
                //   message: "Must be 16 digits",
                // },
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="expiry_date"
                label="Expiry Date"
                placeholder="MM/YY"
                rules={{
                  required: "Required",
                  // pattern: {
                  //   value: /^(0[1-2]|1[0-2])\/?([0-9]{2})$/,
                  //   message: "Use MM/YY",
                  // },
                }}
              />
              <FormInput
                name="cvv"
                label="CVV"
                placeholder="123"
                rules={{
                  required: "Required",
                  pattern: {
                    value: /^\d{3,4}$/,
                    message: "3 or 4 digits",
                  },
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="mt-4 px-6 h-[45px] border border-brown rounded-md shadow-sm text-sm font-medium cursor-pointer text-white hover:text-brown bg-brown dark:bg-dark-brown hover:bg-transparent w-full duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default PaymentPage;
