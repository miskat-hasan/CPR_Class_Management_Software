"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  Table,
  TableHead,
  TableBodyRow,
} from "@/components/common/TableElement";
import { useForm, useFieldArray } from "react-hook-form";
import {
  getSingleKeyCodeBank,
  updateKeyCodeBank,
  deleteKeyCodeBank,
  deleteSingleKeyCode,
} from "@/hooks/api/dashboardApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LucideTrash2 } from "lucide-react";

export default function Page({ params }) {
  const { id }  = params;
  const router  = useRouter();

  const [showDeleteBankModal, setShowDeleteBankModal] = useState(false);
  const [deleteLinkTarget,    setDeleteLinkTarget]    = useState(null);

  const form = useForm({
    defaultValues: {
      name:         "",
      instructions: "",
      course_links: [{ url: "" }],
    },
  });
  const { reset, control, register } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "course_links",
  });

  const { data: keyCodeData, isLoading, refetch } = getSingleKeyCodeBank(id);
  const { mutate: updateMutate,     isPending: isUpdating     } = updateKeyCodeBank();
  const { mutate: deleteBankMutate, isPending: isDeletingBank } = deleteKeyCodeBank();
  const { mutate: deleteLinkMutate, isPending: isDeletingLink } = deleteSingleKeyCode();

  const bankData = keyCodeData?.data;

  useEffect(() => {
    if (bankData) {
      reset({
        name:         bankData.name         ?? "",
        instructions: bankData.instructions ?? "",
        course_links: [{ url: "" }], // always start with one empty row for new links
      });
    }
  }, [bankData, reset]);

  const onSubmit = (data) => {
    // Filter out empty URLs
    const newLinks = data.course_links
      .map((l) => l.url.trim())
      .filter(Boolean)
      .map((url) => ({ url }));

    updateMutate(
      {
        data: {
          id:           Number(id),
          name:         data.name,
          instructions: data.instructions,
          // Only send course_links if user added any
          ...(newLinks.length > 0 && { course_links: newLinks }),
        },
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Updated successfully");
          // Reset new links rows back to one empty
          reset((prev) => ({ ...prev, course_links: [{ url: "" }] }));
          refetch();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Update failed");
        },
      }
    );
  };

  const handleDeleteBank = () => {
    deleteBankMutate(
      { endpoint: `/api/keycode/delete?id=${id}` },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Keycode bank deleted");
          router.back();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Delete failed");
          setShowDeleteBankModal(false);
        },
      }
    );
  };

  const handleDeleteLink = () => {
    deleteLinkMutate(
      { endpoint: `/api/keycode-bank/link/${deleteLinkTarget.id}` },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Link removed");
          setDeleteLinkTarget(null);
          refetch();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Failed to remove");
          setDeleteLinkTarget(null);
        },
      }
    );
  };

  return (
    <>
      <section className="flex flex-col gap-4">
        <SectionTitle title="Edit Keycode Bank" />

        {/* ── Single card: name + instructions + add new links ── */}
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

              {/* Add new course links */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray">
                  Add New Keycodes / Course Links
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 font-normal">
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

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <BackButton />
              <Button
                type="button"
                onClick={() => setShowDeleteBankModal(true)}
                disabled={isDeletingBank}
                className="px-6 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Keycode Bank
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Update Keycode Bank"}
              </Button>
            </div>
          </FormContainer>
        </div>

        {/* ── Existing links table ── */}
        <div className="bg-white dark:bg-black rounded-[14px] p-6 shadow-sm flex flex-col gap-4">
          <h6 className="font-semibold text-base text-black dark:text-gray">
            Keycodes / Course Links
          </h6>

          {isLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <tr>
                    <th className="px-4 py-3 text-left whitespace-nowrap">#</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">
                      Course Link / URL
                    </th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </TableHead>
                <tbody>
                  {bankData?.links?.length > 0 ? (
                    bankData.links.map((link) => (
                      <TableBodyRow key={link.id}>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 w-12">
                          {link.label}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <a
                            href={link.course_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brown hover:underline break-all"
                          >
                            {link.course_link}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => setDeleteLinkTarget(link)}
                            className="p-2 bg-neutral-100 dark:bg-gray-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition cursor-pointer"
                          >
                            <LucideTrash2 className="size-4 text-gray-500 dark:text-gray" />
                          </button>
                        </td>
                      </TableBodyRow>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-6 text-gray-400 italic text-sm"
                      >
                        No links found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </section>

      {/* Delete bank modal */}
      <ConfirmModal
        open={showDeleteBankModal}
        title="Delete this keycode bank?"
        description={`"${bankData?.name}" and all its links will be permanently deleted.`}
        confirmLabel="Delete Bank"
        onConfirm={handleDeleteBank}
        onCancel={() => setShowDeleteBankModal(false)}
        isPending={isDeletingBank}
      />

      {/* Delete single link modal */}
      <ConfirmModal
        open={!!deleteLinkTarget}
        title="Remove this link?"
        description={`This will permanently remove: ${deleteLinkTarget?.course_link}`}
        confirmLabel="Remove Link"
        onConfirm={handleDeleteLink}
        onCancel={() => setDeleteLinkTarget(null)}
        isPending={isDeletingLink}
      />
    </>
  );
}