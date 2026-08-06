// src/components/dashboard/Instructors/CertificationModal.jsx
"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

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
import {
  getAllDiscipline,
  getSingleCertification,
  storeCertification,
  updateCertification,
} from "@/hooks/api/dashboardApi";

const DEFAULT_VALUES = { discipline: "", initial: "", expires: "" };

const CertificationModal = ({
  mode = "add",
  instructorId,
  certificationId,
}) => {
  const isEdit = mode === "edit";
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({ defaultValues: DEFAULT_VALUES });
  const { control, reset } = form;

  const { data: allDiscipline, isLoading: loadingDiscipline } =
    getAllDiscipline();

  const { data: singleCertification, isLoading: loadingSingleCertification } =
    getSingleCertification(isEdit && open ? certificationId : undefined);

  const { mutateAsync: createMutate, isPending: creating } =
    storeCertification();
  const { mutateAsync: updateMutate, isPending: updating } =
    updateCertification();
  const isPending = isEdit ? updating : creating;

  useEffect(() => {
    if (!open) return;

    if (isEdit && singleCertification?.data && allDiscipline?.data) {
      reset({
        discipline: Number(singleCertification.data.discipline_id),
        initial: singleCertification.data.initial,
        expires: singleCertification.data.expires,
      });
    }

    if (!isEdit) {
      reset(DEFAULT_VALUES);
    }
  }, [open, isEdit, singleCertification, allDiscipline, reset]);

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append("discipline_id", data?.discipline);
    formData.append("initial", data?.initial);
    formData.append("expires", data?.expires);

    if (isEdit) {
      formData.append("id", certificationId);
    } else {
      formData.append("instructor_id", instructorId);
    }

    const mutate = isEdit ? updateMutate : createMutate;

    await mutate(formData, {
      onSuccess: resData => {
        toast.success(
          resData?.message ||
            (isEdit
              ? "Certification updated successfully"
              : "Certification added successfully"),
        );
        queryClient.invalidateQueries(["get-single-instructor", instructorId]);
        setOpen(false);
        reset(DEFAULT_VALUES);
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  const loadingForm = isEdit
    ? loadingSingleCertification || loadingDiscipline
    : loadingDiscipline;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <button className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
            <CiEdit className="text-gray-600 dark:text-gray text-[14px] sm:text-[16px]" />
          </button>
        ) : (
          <Button className="px-6 py-2 bg-brown dark:bg-dark-brown text-white rounded-md text-sm font-medium hover:bg-brown-hover cursor-pointer flex items-center gap-2">
            <FaPlus className="size-3" />
            Add Certification
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-gray">
            {isEdit ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
        </DialogHeader>

        {loadingForm ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <FormContainer form={form} onSubmit={onSubmit}>
            <div className="space-y-2.5 lg:space-y-5">
              <Controller
                name="discipline"
                control={control}
                rules={{ required: "Discipline is required" }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="Discipline"
                    label="Discipline"
                    isLoading={loadingDiscipline}
                    placeholder="Chose Discipline"
                    options={allDiscipline?.data?.data}
                    className="flex-1"
                  />
                )}
              />
              <div className="flex gap-6">
                <FormInput name="initial" label="Initial Date" type="date" />
                <FormInput name="expires" label="Expires Date" type="date" />
              </div>
            </div>

            <div className="flex justify-end gap-2 lg:gap-4 mt-5 lg:mt-8">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-700 dark:text-gray hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Saving ..." : "Save Changes"}
              </Button>
            </div>
          </FormContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CertificationModal;
