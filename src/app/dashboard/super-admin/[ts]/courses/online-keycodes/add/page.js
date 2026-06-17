"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import KeycodeBankForm from "@/components/dashboard/courses/keycodes/KeycodeBankForm";
import { useForm } from "react-hook-form";
import { addKeyCodeBank } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const { selectedTrainingSiteId } = useAuth();

  const form = useForm({
    defaultValues: {
      name: "",
      instructions: "",
      course_links: [{ url: "" }],
    },
  });
  const { control, register, reset } = form;

  const { mutate, isPending } = addKeyCodeBank();

  const onSubmit = data => {
    const urls = data.course_links
      .map(l => l.url.trim())
      .filter(Boolean)
      .map(url => ({ url }));

    mutate(
      {
        data: {
          name: data.name,
          instructions: data.instructions,
          training_site_id: selectedTrainingSiteId,
          course_links: urls,
        },
      },
      {
        onSuccess: res => {
          toast.success(res?.message || "Keycode bank added successfully");
          reset();
          router.back();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add Keycode Bank" />
      <div className="bg-white dark:bg-black rounded-[14px] p-8 shadow-sm">
        <FormContainer form={form} onSubmit={onSubmit}>
          <KeycodeBankForm
            control={control}
            register={register}
            isPending={isPending}
          />
        </FormContainer>
      </div>
    </section>
  );
}
