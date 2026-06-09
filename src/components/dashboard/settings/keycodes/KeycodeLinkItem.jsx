"use client";

import { LucideTrash2 } from "lucide-react";

export default function KeycodeLinkItem({ link, onDelete, isDeleting }) {
  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-6 text-center">
          #{link.label}
        </span>
        <a
          href={link.course_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brown hover:underline truncate"
        >
          {link.course_link}
        </a>
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="p-2 bg-neutral-100 dark:bg-gray-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition cursor-pointer shrink-0 disabled:opacity-50"
      >
        <LucideTrash2 className="size-4 text-gray-500 dark:text-gray" />
      </button>
    </div>
  );
}
