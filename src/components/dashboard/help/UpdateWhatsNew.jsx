"use client";
import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { getSingleWhatsNew, updateWhatsNew } from "@/hooks/api/dashboardApi";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateWhatIsNew = ({ id }) => {
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const { reset } = form;

  const { data, isLoading } = getSingleWhatsNew(id);

  useEffect(() => {
    if (data) {
      reset({
        title: data?.data?.title || "",
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = updateWhatsNew();

  const onSubmit = data => {
    mutate(
      { id: id, ...data },
      {
        onSuccess: data => {
          toast.success(data?.message);
        },
      },
    );
  };
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Update What's New" />
      {isLoading ? (
        <div className="px-1.5 py-3 min-[374px]:p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px] animate-pulse">
          <div className="flex flex-col gap-3 lg:gap-6">
            {/* Label Skeleton */}
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
            {/* Input Skeleton */}
            <div className="h-12 w-full bg-gray-100 dark:bg-gray-900 rounded-lg"></div>

            {/* Buttons Skeleton */}
            <div className="flex justify-end gap-4 mt-8">
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
              <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-1.5 py-3 min-[374px]:p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
          <FormContainer form={form} onSubmit={onSubmit}>
            <div className="flex flex-col gap-3 lg:gap-6">
              <FormInput name="title" />
              <div className="flex justify-end gap-4 mt-8">
                <BackButton />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-brown dark:bg-dark-brown hover:bg-brown  text-white px-8"
                >
                  {isPending ? "Updating ..." : "Update What's New"}
                </Button>
              </div>
            </div>
          </FormContainer>
        </div>
      )}
    </section>
  );
};

export default UpdateWhatIsNew;
