"use client";
import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { addWhatsNew } from "@/hooks/api/dashboardApi";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddWhatIsNew = () => {
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const { reset } = form;

  const { mutate, isPending } = addWhatsNew();

  const onSubmit = data => {
    mutate(data, {
      onSuccess: data => {
        reset({ title: "" });
        toast.success(data?.message);
      },
    });
  };
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add What's New" />

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
                {isPending ? "Adding ..." : "Add What's New"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default AddWhatIsNew;
