import { AlertTriangle, Trash2 } from "lucide-react";
import { IoClose } from "react-icons/io5";

const DeleteUserConfirmModal = ({ user, onConfirm, onCancel, isPending }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 shrink-0">
              <AlertTriangle
                className="text-red-600 dark:text-red-400"
                size={20}
              />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100">
              Delete User
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <IoClose size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 dark:text-zinc-200">
              {user.name}
            </span>
            ? This action{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              cannot be undone
            </span>{" "}
            and will permanently remove the user and all associated data.
          </p>

          {/* User summary card */}
          <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-400 uppercase">
                {user.name?.charAt(0) ?? "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-zinc-200 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(user.id)}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-lg transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserConfirmModal;
