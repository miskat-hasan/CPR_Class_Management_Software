// src/components/dashboard/trainingSites/SiteCoordinatorModal.jsx
"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";
import { getAllCountry, storeSiteCoordinator } from "@/hooks/api/dashboardApi";

const DEFAULT_VALUES = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state_province_region: "",
  zip_postal_code: "",
  country: "",
};

// onCreated receives { id, name, email } for the newly created coordinator
const SiteCoordinatorModal = ({ onCreated }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({ defaultValues: DEFAULT_VALUES });
  const {
    control,
    reset,
    formState: { errors },
  } = form;

  const { data: countryData, isLoading: countryLoading } = getAllCountry();
  const { mutateAsync, isPending } = storeSiteCoordinator();

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("address_line_1", data.address_line_1);
    formData.append("address_line_2", data.address_line_2);
    formData.append("city", data.city);
    formData.append("state_province_region", data.state_province_region);
    formData.append("zip_postal_code", data.zip_postal_code);
    formData.append("country_id", data.country);

    await mutateAsync(formData, {
      onSuccess: res => {
        toast.success(res?.message || "Site coordinator added successfully");
        onCreated?.({
          id: res?.data?.id,
          name: `${data.first_name} ${data.last_name}`.trim(),
          email: data.email,
        });
        reset(DEFAULT_VALUES);
        setOpen(false);
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-sm font-medium text-brown dark:text-dark-brown underline underline-offset-2 cursor-pointer"
        >
          + New Coordinator
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-black dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-gray">
            New Site Coordinator
          </DialogTitle>
        </DialogHeader>

        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="first_name"
              label="First Name"
              placeholder="First name"
              rules={{ required: "First name is required" }}
            />
            <FormInput
              name="last_name"
              label="Last Name"
              placeholder="Last name"
              rules={{ required: "Last name is required" }}
            />
            <FormInput
              name="username"
              label="Username"
              placeholder="Username"
              rules={{ required: "Username is required" }}
            />
            <FormInput
              name="email"
              label="Email"
              placeholder="Email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
            />

            <FormInput
              name="address_line_1"
              label="Address 1"
              placeholder="Address"
            />
            <FormInput
              name="address_line_2"
              label="Address 2"
              placeholder="Address"
            />
            <FormInput name="city" label="City" placeholder="City" />
            <FormInput
              name="state_province_region"
              label="State/Province/Region"
              placeholder="State"
            />
            <FormInput
              name="zip_postal_code"
              label="Zip/Postal Code"
              placeholder="Postal code"
            />
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="Country"
                  placeholder="Select country"
                  isLoading={countryLoading}
                  options={countryData?.data}
                  error={errors.country?.message}
                />
              )}
            />
            <FormInput
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              }}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-700 dark:text-gray hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Coordinator"}
            </Button>
          </div>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
};

export default SiteCoordinatorModal;
