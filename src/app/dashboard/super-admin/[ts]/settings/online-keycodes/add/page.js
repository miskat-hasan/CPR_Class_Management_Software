"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import { useForm, useFieldArray } from "react-hook-form";
import { addKeyCodeBank } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";
import { LucideTrash2 } from "lucide-react";

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

  const {
    control,
    register,
    reset,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "course_links",
  });

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
          <div className="flex flex-col gap-5">
            <FormInput
              name="name"
              label="Name"
              placeholder="Keycode bank name"
              rules={{ required: "Name is required" }}
            />

            <FormTextarea
              name="instructions"
              label="Instructions"
              placeholder="Instructions here"
            />

            {/* Course Links */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray">
                Add New Keycodes / Course Links
                <span className="text-xs text-gray-400 ml-2 font-normal">
                  (one per line)
                </span>
              </label>

              <div className="flex flex-col gap-2 bg-neutral-50 dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-md p-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      {...register(`course_links.${index}.url`)}
                      placeholder="https://..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 bg-neutral-200 dark:bg-gray-700 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition cursor-pointer"
                      >
                        <LucideTrash2 className="size-4 text-gray-600 dark:text-gray" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => append({ url: "" })}
                  className="mt-1 px-3 py-1.5 inline-flex items-center gap-1.5 border rounded-md text-sm bg-neutral-700 dark:bg-gray-800 text-neutral-100 cursor-pointer hover:bg-neutral-600 w-fit"
                >
                  <FaPlus className="size-3" />
                  Add more
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <BackButton />
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Adding..." : "Add Keycode Bank"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </section>
  );
}
