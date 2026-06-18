"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { storeCourseImage, updateCourseImage } from "@/hooks/api/dashboardApi";
import Image from "next/image";
import { useEffect } from "react";

function CourseImageModal({ open, onClose, onSuccess, editItem }) {
  const isEdit = !!editItem;

  const form = useForm({
    defaultValues: { title: "", image: null },
  });
  const { reset, setValue, watch } = form;
  const previewFile = watch("image");

  useEffect(() => {
    if (editItem) {
      reset({ title: editItem.title ?? "", image: null });
    } else {
      reset({ title: "", image: null });
    }
  }, [editItem, reset]);

  const { mutate: storeMutate, isPending: isStoring } = storeCourseImage();
  const { mutate: updateMutate, isPending: isUpdating } = updateCourseImage();
  const isPending = isStoring || isUpdating;

  const onSubmit = data => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.image) formData.append("image", data.image);
    if (isEdit) formData.append("id", editItem.id);

    const mutate = isEdit ? updateMutate : storeMutate;
    mutate(formData, {
      onSuccess: res => {
        toast.success(
          res?.message || `Course image ${isEdit ? "updated" : "added"}`,
        );
        reset();
        onSuccess?.();
        onClose();
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-dark w-full max-w-md mx-4 rounded-xl shadow-xl p-6 flex flex-col gap-5">
        <h4 className="text-base font-semibold text-black dark:text-gray">
          {isEdit ? "Edit Course Image" : "Add Course Image"}
        </h4>
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <FormInput
              name="title"
              label="Title"
              placeholder="Image title"
              rules={{ required: "Title is required" }}
              defaultValue={editItem?.title ?? ""}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray">
                Image{" "}
                {isEdit && (
                  <span className="text-xs font-normal text-gray-400">
                    (leave empty to keep current)
                  </span>
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-neutral-100 dark:file:bg-gray-700 dark:file:text-gray file:text-neutral-800 hover:file:bg-neutral-200 cursor-pointer dark:text-gray"
                onChange={e => setValue("image", e.target.files?.[0] ?? null)}
              />
              {/* Preview */}
              {previewFile ? (
                <Image
                  src={URL.createObjectURL(previewFile)}
                  width={80}
                  height={80}
                  alt="Preview"
                  className="object-cover rounded border dark:border-gray-700 mt-1"
                />
              ) : editItem?.image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${editItem.image}`}
                  width={80}
                  height={80}
                  alt={editItem.title}
                  className="object-cover rounded border dark:border-gray-700 mt-1"
                />
              ) : null}
            </div>
          </div>
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
              {isPending ? "Saving..." : isEdit ? "Update" : "Add"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}

export default CourseImageModal;
