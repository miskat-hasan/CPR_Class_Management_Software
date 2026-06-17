"use client";

import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import { TableButton } from "@/components/common/TableElement";
import { useFieldArray } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { LucideTrash2 } from "lucide-react";

export default function KeycodeBankForm({
  control,
  register,
  isEdit = false,
  isPending = false,
  onDelete,
  isDeleting = false,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "course_links",
  });

  return (
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
                <TableButton
                  isLink={false}
                  type="button"
                  onClick={() => remove(index)}
                >
                  <LucideTrash2 className="size-4 text-gray-600 dark:text-gray" />
                </TableButton>
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

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-3">
        <BackButton />
        {isEdit && onDelete && (
          <Button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="px-6 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete Keycode Bank"}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
              ? "Update Keycode Bank"
              : "Add Keycode Bank"}
        </Button>
      </div>
    </div>
  );
}
