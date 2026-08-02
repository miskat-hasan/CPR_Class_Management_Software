"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetTCProduct,
  useTSProductCheckout,
} from "@/hooks/api/dashboardApi";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import SectionTitle from "@/components/common/SectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Link from "next/link";
import { toast } from "sonner";

const MultiStepOrderPage = ({ params }) => {
  const { ts } = params;
  const router = useRouter();
  const [formStep, setFormStep] = useState(1);

  const { data: tcProductOrderData, isLoading: tcProductOrderLoading } =
    useGetTCProduct();

  const form = useForm({
    defaultValues: {
      product_id: [],
      quantity: [],
      training_site_id: ts || "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      promo_code: "",
      postal_code: "",
      payment_method: "credit_card",
      note: "",
      card_number: "",
      expiry_date: "",
      cvv: "",
    },
    mode: "onChange",
  });

  const { setValue, handleSubmit, watch } = form;
  const { mutate, isPending } = useTSProductCheckout();

  const quantities = watch("quantity");

  // Set product IDs once data is loaded
  useEffect(() => {
    if (tcProductOrderData?.data?.data) {
      const ids = tcProductOrderData.data.data.map((p) => p.id);
      setValue("product_id", ids);
      setValue(
        "quantity",
        ids.map(() => ""),
      );
    }
  }, [tcProductOrderData, setValue]);

  const getFilteredOrderData = (formData) => {
    const filtered = [];
    formData.product_id.forEach((id, index) => {
      const qty = Number(formData.quantity[index]);
      if (qty > 0) {
        filtered.push({
          product_id: id,
          quantity: qty,
        });
      }
    });

    const payload = {
      ...formData,
      product_id: filtered.map((item) => item.product_id),
      quantity: filtered.map((item) => item.quantity),
    };

    // Clean card fields for invoice
    if (payload.payment_method === "invoice") {
      payload.card_number = null;
      payload.expiry_date = null;
      payload.cvv = null;
    }

    return payload;
  };

  const handleFinalSubmit = (data) => {
    const payload = getFilteredOrderData(data);

    // Optional: prevent submission if no products selected
    if (payload.product_id.length === 0) {
      Swal.fire({
        text: "Please select at least one product with quantity > 0",
        icon: "warning",
      });
      return;
    }

    mutate(payload, {
      onSuccess: (res) => {
        toast.success(res?.message || "Order placed successfully");
        router.back();
      },
    });
  };

  // Step 1: Enter Quantities

  const renderProductStep = () => (
    <>
      <SectionTitle title="Add Quantities" />
      {tcProductOrderLoading ? (
        <TableSkeleton />
      ) : (
        <FormContainer form={form} onSubmit={() => setFormStep(2)}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-black font-semibold">
                <tr>
                  <th className="px-3 py-3">Quantity</th>
                  <th className="px-3 py-3">Product Code</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3 text-center">Price</th>
                </tr>
              </thead>
              <tbody>
                {tcProductOrderData?.data?.data?.length > 0 ? (
                  tcProductOrderData.data.data.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <FormInput
                          name={`quantity[${index}]`}
                          placeholder="0"
                          type="number"
                          min={0}
                          className="min-w-[80px]"
                        />
                      </td>
                      <td className="px-3 py-4">
                        {item.code || `CODE-${item.id}`}
                      </td>
                      <td className="px-3 py-4">{item.name}</td>
                      <td className="px-3 py-4 text-center">${item.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-4 mt-5">
            <Button
              type="button"
              variant="outline"
              className={"cursor-pointer"}
              asChild
            >
              <Link href={"../ts_product_orders"}>Back</Link>
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-brown dark:bg-dark-brown text-white rounded-md"
            >
              Proceed
            </Button>
          </div>
        </FormContainer>
      )}
    </>
  );

  // Step 2: Order Summary & Payment Info

  const renderOrderStep = () => {
    const products = tcProductOrderData?.data?.data || [];
    let subtotal = 0;

    const orderItems = products
      .map((item, index) => {
        const qty = Number(quantities?.[index] || 0);
        if (qty <= 0) return null;
        const total = qty * Number(item.price);
        subtotal += total;
        return { ...item, qty, total };
      })
      .filter(Boolean);

    const paymentType = watch("payment_method");

    return (
      <>
        <SectionTitle title="Order Details" />

        {/* Order Summary Table */}
        <div className="mb-8 mt-3">
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Product Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-3">{item.qty}</td>
                      <td className="px-4 py-3">
                        {item.code || `CODE-${item.id}`}
                      </td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-right">${item.price}</td>
                      <td className="px-4 py-3 text-right">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-gray-500 italic"
                    >
                      No products selected
                    </td>
                  </tr>
                )}
                <tr className="font-semibold bg-gray-50">
                  <td colSpan={4} className="px-4 py-3 text-right">
                    Total Charge:
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <FormContainer
          form={form}
          onSubmit={handleSubmit((data) => {
            if (data.payment_method === "credit_card") {
              setFormStep(3);
            } else {
              handleFinalSubmit(data);
            }
          })}
        >
          <div className="space-y-5 pb-6">
            <SectionTitle title="Payment Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput name="first_name" label="First Name *" required />
              <FormInput name="last_name" label="Last Name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="email"
                label="Email Address *"
                type="email"
                required
              />
              <FormInput name="phone" label="Phone Number" />
            </div>

            <FormInput
              name="address_line_1"
              label="Address Line 1 *"
              required
            />
            <FormInput name="address_line_2" label="Address Line 2" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput name="city" label="City *" required />
              <FormInput name="state" label="State" />
              <FormInput name="postal_code" label="Zip / Postal Code" />
            </div>

            <FormInput name="promo_code" label="Promo Code" />

            <FormInput
              name="note"
              label="Comments / Requests"
              type="textarea"
              placeholder="Any special instructions..."
            />

            {/* Payment Method */}
            <div className="flex flex-col sm:flex-row gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="credit_card"
                  {...form.register("payment_method")}
                />
                Credit Card
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="invoice"
                  {...form.register("payment_method")}
                />
                Invoice
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                className={"cursor-pointer"}
                onClick={() => setFormStep(1)}
              >
                Back to Products
              </Button>
              <Button type="submit" disabled={orderItems.length === 0}>
                {paymentType === "credit_card"
                  ? "Proceed to Payment"
                  : "Place Order (Invoice)"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </>
    );
  };

  // Step 3: Credit Card Details

  const renderPaymentStep = () => (
    <>
      <SectionTitle title="Payment Details" />
      <FormContainer form={form} onSubmit={handleSubmit(handleFinalSubmit)}>
        <div className="space-y-5 max-w-md mt-4">
          <FormInput
            name="card_number"
            label="Card Number *"
            placeholder="1234 5678 9012 3456"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="expiry_date"
              label="Expiry Date *"
              placeholder="MM/YY"
              required
            />
            <FormInput name="cvv" label="CVV *" placeholder="123" required />
          </div>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormStep(2)}
              className={"cursor-pointer"}
            >
              Back
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </FormContainer>
    </>
  );

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">
      <FormProvider {...form}>
        {formStep === 1 && renderProductStep()}
        {formStep === 2 && renderOrderStep()}
        {formStep === 3 && renderPaymentStep()}
      </FormProvider>
    </div>
  );
};

export default MultiStepOrderPage;
