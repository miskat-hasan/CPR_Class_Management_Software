"use client";

import { Button } from "@/components/ui/button";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isPending = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Modal */}
      <div className="relative z-10 bg-white dark:bg-dark w-full max-w-md mx-4 rounded-xl shadow-xl p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-semibold text-black dark:text-gray">
            {title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-700 dark:text-gray hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
