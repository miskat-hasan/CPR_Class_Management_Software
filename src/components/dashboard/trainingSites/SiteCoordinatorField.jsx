// src/components/dashboard/trainingSites/SiteCoordinatorField.jsx
"use client";

import { useEffect, useState } from "react";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { useGetAllUsers } from "@/hooks/api/dashboardApi";
import SiteCoordinatorModal from "./SiteCoordinatorModal";
import { X } from "lucide-react";

// Controlled by the parent form: value/onChange manage `user_id`,
// selectedLabel is the display text for the currently selected coordinator (if any)
const SiteCoordinatorField = ({
  value,
  onChange,
  selectedLabel,
  onSelectLabel,
}) => {
  const [panelOpen, setPanelOpen] = useState(Boolean(value));

  // `value` can arrive asynchronously (edit mode fetches the training site,
  // then calls reset() once it resolves) — open the panel whenever a real
  // coordinator id shows up, not just on first mount.
  useEffect(() => {
    if (value) setPanelOpen(true);
  }, [value]);

  const { data: candidates, isLoading } = useGetAllUsers(
    "all",
    1,
    10,
    [2, 3, 4, 7],
  );
  const options = (candidates?.data ?? []).map(u => ({
    id: u.id,
    name: `${u.name} (${u.email})`,
  }));

  const clearCoordinator = () => {
    onChange("");
    onSelectLabel?.("");
    setPanelOpen(false);
  };

  if (!panelOpen) {
    return (
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-sm text-gray-700 dark:text-gray">
          Site Coordinator
        </p>
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="w-fit px-3 py-1.5 border dark:border-gray-600 rounded-md text-sm bg-neutral-700 dark:bg-gray-800 text-neutral-100 cursor-pointer hover:bg-neutral-600 dark:hover:bg-gray-700"
        >
          + Add Site Coordinator
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-gray-700 dark:text-gray">
          Site Coordinator
        </p>
        <button
          type="button"
          onClick={clearCoordinator}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {value && selectedLabel ? (
        <div className="flex items-center justify-between px-3 py-2 border dark:border-gray-600 rounded-md bg-neutral-50 dark:bg-dark text-sm">
          <span className="text-gray-800 dark:text-gray">{selectedLabel}</span>
        </div>
      ) : (
        <>
          <CustomSelect
            value={value}
            onChange={val => {
              onChange(val);
              const match = options.find(o => String(o.id) === String(val));
              onSelectLabel?.(match?.name ?? "");
            }}
            placeholder="Select existing (coordinator, admin, instructor, or assistant)"
            isLoading={isLoading}
            options={options}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">
            or{" "}
            <SiteCoordinatorModal
              onCreated={coordinator => {
                onChange(coordinator.id);
                onSelectLabel?.(`${coordinator.name} (${coordinator.email})`);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SiteCoordinatorField;
