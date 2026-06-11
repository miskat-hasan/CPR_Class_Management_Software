"use client";

import { useForm } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { storeCertifyingBody } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";

export default function AddCertifyingBodyModal({ open, onClose, onSuccess }) {
  const form = useForm({
    defaultValues: { name: "" },
  });
  const { reset } = form;

  const { mutate, isPending } = storeCertifyingBody();

  const onSubmit = data => {
    mutate(
      { data: { name: data.name } },
      {
        onSuccess: res => {
          toast.success(res?.message || "Certifying body added successfully");
          reset();
          onSuccess?.();
          onClose();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-dark w-full max-w-md mx-4 rounded-xl shadow-xl p-6 flex flex-col gap-5">
        <h4 className="text-base font-semibold text-black dark:text-gray">
          Add Certifying Body
        </h4>

        <FormContainer form={form} onSubmit={onSubmit}>
          <FormInput
            name="name"
            label="Name"
            placeholder="e.g. American Heart Association"
            rules={{ required: "Name is required" }}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isPending}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-700 dark:text-gray hover:bg-gray-50 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
