"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddLinksForm({ onAdd, isLoading }) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const urls = value
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(url => ({ url }));

    if (!urls.length) return;
    onAdd(urls, () => setValue(""));
  };

  return (
    <div className="flex flex-col gap-2 pt-4">
      <label className="text-sm font-medium text-gray-700 dark:text-gray">
        Add New Keycodes / Course Links
        <span className="text-xs text-gray-400 ml-2 font-normal">
          (one per line)
        </span>
      </label>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={5}
        placeholder={"https://example.com\nhttps://another-link.com"}
        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
      />
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleAdd}
          disabled={isLoading || !value.trim()}
          className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Links"}
        </Button>
      </div>
    </div>
  );
}
