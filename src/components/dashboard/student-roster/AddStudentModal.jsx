// src/components/dashboard/class-and-students/AddStudentModal.jsx
"use client";

import { Controller, useForm } from "react-hook-form";
import FormContainer from "../../shared/form/FormContainer";
import FormInput from "../../shared/form/FormInput";
import { getAllCountry, useStoreStudentData } from "@/hooks/api/dashboardApi";
import CustomSelect from "../../shared/form/CustomSelect";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const status = [
  { id: "Pending", name: "Pending" },
  { id: "Complete", name: "Completed" },
  { id: "Incomplete", name: "Incomplete" },
  { id: "Remediate", name: "Remediate" },
  { id: "No Show", name: "No Show" },
  { id: "Waitlisted", name: "Waitlisted" },
];

const AddStudentModal = ({ classId, open, onClose }) => {
  const queryClient = useQueryClient();

  const form = useForm();

  const {
    control,
    formState: { errors },
  } = form;

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  const { mutate, isPending } = useStoreStudentData();

  if (!open) {
    return null;
  }

  const onSubmit = data => {
    mutate(
      { class_details_id: classId, course_id: classId, ...data },
      {
        onSuccess: data => {
          queryClient.invalidateQueries(["get-student-by-class", classId]);
          toast.success(data?.message || "Student added successfully");
          onClose();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  return (
    <div
      onClick={onClose}
      className="w-full h-screen bg-black/50 fixed top-0 left-0 flex items-center justify-center px-2 z-50"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-black p-4 lg:p-6 rounded-lg shadow max-w-[600px] w-full"
      >
        <h5 className="text-black dark:text-white text-[20px] font-medium leading-[32.5px] mb-2">
          Add Student
        </h5>
        <FormContainer form={form} onSubmit={onSubmit}>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 lg:gap-3">
            <FormInput
              name="first_name"
              placeholder="First Name"
              rules={{ required: "First Name is required" }}
            />
            <FormInput
              name="last_name"
              placeholder="Last Name"
              rules={{ required: "Last Name is required" }}
            />
            <FormInput
              name="email"
              placeholder="Email Address"
              rules={{ required: "Email is required" }}
            />
            <FormInput
              name="primary_phone"
              placeholder="Mobile Phone"
              rules={{ required: "Mobile Phone is required" }}
            />
            <FormInput
              name="username"
              placeholder="Username"
              rules={{ required: "Username is required" }}
            />
            <FormInput
              name="password"
              placeholder="Password"
              type="password"
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              }}
            />
            <FormInput name="address_1" placeholder="Address 1" />
            <FormInput name="address_2" placeholder="Address 2" />
            <FormInput name="city" placeholder="City" />
            <FormInput name="state" placeholder="State" />
            <FormInput name="zip" placeholder="Zip" />
            <Controller
              name="country_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="country"
                  placeholder="Country"
                  isLoading={countryDataLoading}
                  options={countryData?.data}
                  error={errors.country_id?.message}
                  className="flex-1"
                />
              )}
            />
            <FormInput name="score" placeholder="Test Score" />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="status"
                  placeholder="Status"
                  options={status}
                  error={errors.status?.message}
                  className="flex-1"
                />
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={onClose}
              type="button"
              variant="outline"
              className={"cursor-pointer dark:text-white"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none disabled:opacity-60 dark:hover:bg-brown"
              disabled={isPending}
            >
              {isPending ? "Processing ..." : "Add Student"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default AddStudentModal;
