"use client";

import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import { getAllKeyCodeBank } from "@/hooks/api/dashboardApi";
import { Controller, useWatch } from "react-hook-form";

const DISPLAY_ORDER_OPTIONS = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    name: String(i + 1),
  })),
  { id: "n/a", name: "N/A" },
];

const TYPE_OPTIONS = [
  { value: "shippable_item", label: "Shippable Item" },
  { value: "non_shippable_item", label: "Non-shippable Item" },
  { value: "keycode", label: "KeyCode" },
];

export default function ProductAddOnForm({
  control,
  register,
  isPending = false,
  isEdit = false,
}) {
  const selectedType = useWatch({ control, name: "type" });
  const isKeycode = selectedType === "keycode";

  // Only fetch keycode banks when type is keycode
  const { data: keycodeBanksData, isLoading: keycodeBanksLoading } =
    getAllKeyCodeBank(1, 100, { enabled: isKeycode });

  return (
    <div className="flex flex-col gap-5">
      {/* Main fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <FormInput
          name="productCode"
          label="Product Code"
          placeholder="Product code"
        />
        <FormInput
          name="name"
          label="Name"
          placeholder="Product name"
          rules={{ required: "Name is required" }}
        />
        <FormInput
          name="description"
          label="Description"
          placeholder="Description / notes"
        />
        <Controller
          name="displayOrder"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              id="display_order"
              label="Display Order"
              placeholder="Select display order"
              options={DISPLAY_ORDER_OPTIONS}
            />
          )}
        />
        <FormInput name="price" label="Price" placeholder="0.00" />
        <FormInput
          name="quickbookName"
          label="QuickBooks Item Name"
          placeholder="QuickBooks item name"
        />
      </div>

      {/* Type */}
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-sm text-gray-700 dark:text-gray">
          Type
        </p>
        <div className="flex flex-col gap-2 dark:text-gray">
          {TYPE_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm cursor-pointer w-fit"
            >
              <input
                type="radio"
                value={opt.value}
                {...register("type")}
                className="accent-brown"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Keycode bank dropdown — only when type is keycode */}
      {isKeycode && (
        <Controller
          name="keycodeBank"
          control={control}
          rules={{ required: "Keycode bank is required" }}
          render={({ field, fieldState }) => (
            <CustomSelect
              {...field}
              id="keycode_bank"
              label="Keycode Bank"
              placeholder="Select keycode bank"
              isLoading={keycodeBanksLoading}
              options={keycodeBanksData?.data?.data ?? []}
              error={fieldState.error?.message}
            />
          )}
        />
      )}

      {/* Options */}
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-sm text-gray-700 dark:text-gray">
          Options
        </p>
        <label className="inline-flex w-fit items-center gap-2 text-sm dark:text-gray cursor-pointer">
          <input
            type="checkbox"
            {...register("defaultSelection")}
            className="accent-brown"
          />
          Default the selection to &quot;yes&quot; for all registrations
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-3">
        <BackButton />
        <Button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Add Product Add-on"}
        </Button>
      </div>
    </div>
  );
}
