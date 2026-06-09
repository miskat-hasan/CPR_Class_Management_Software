"use client";

import { useState } from "react";
import { toast } from "sonner";
import KeycodeLinkItem from "./KeycodeLinkItem";
import AddLinksForm from "./AddLinksForm";
import ConfirmModal from "@/components/common/ConfirmModal";
import { deleteSingleKeyCode } from "@/hooks/api/dashboardApi";

export default function KeycodeLinksSection({
  links = [],
  isLoading,
  onAddLinks,
  isAddingLinks,
  onRefetch,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null); // link object

  const { mutate: deleteLinkMutate, isPending: isDeletingLink } =
    deleteSingleKeyCode();

  const handleConfirmDelete = () => {
    deleteLinkMutate(
      { endpoint: `/api/keycode-bank/link/${deleteTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Link removed");
          setDeleteTarget(null);
          onRefetch();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Failed to remove link");
          setDeleteTarget(null);
        },
      },
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-black rounded-[14px] p-6 shadow-sm flex flex-col gap-4">

        <AddLinksForm onAdd={onAddLinks} isLoading={isAddingLinks} />

        <h6 className="font-semibold text-base text-black dark:text-gray">
          Keycodes / Course Links
        </h6>
        {isLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : links.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
            {links.map(link => (
              <KeycodeLinkItem
                key={link.id}
                link={link}
                onDelete={() => setDeleteTarget(link)}
                isDeleting={isDeletingLink && deleteTarget?.id === link.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No links found.</p>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this link?"
        description={`This will permanently remove: ${deleteTarget?.course_link}`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isDeletingLink}
      />
    </>
  );
}
