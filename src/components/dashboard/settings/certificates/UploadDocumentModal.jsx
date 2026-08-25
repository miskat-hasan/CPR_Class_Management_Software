"use client";

import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { uploadCertification } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

const UploadDocumentModal = ({ open, onOpenChange }) => {
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: { name: "" },
  });

  const { reset } = form;

  const {
    mutate: uploadCertificateMutation,
    isPending: uploadCertificatePending,
  } = uploadCertification();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFile(null);
      reset({ name: "" });
    }
  }, [open, reset]);

  const handleFileChange = e => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onSubmit = data => {
    if (!file) {
      return toast.error("Please select a file first.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", data.name);

    uploadCertificateMutation(formData, {
      onSuccess: resData => {
        setFile(null);
        reset({ name: "" });
        toast.success(resData?.message || "Certificate uploaded successfully");
        queryClient.invalidateQueries("get-all-certification-file");
        onOpenChange(false);
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-gray">
            Upload Certificate
          </DialogTitle>
        </DialogHeader>

        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="space-y-5">
            <FormInput
              name="name"
              label="Certificate Name"
              rules={{ required: "Certificate name is required" }}
              error={form.formState.errors.name?.message}
            />

            <div>
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-500 dark:text-gray hover:text-gray-700 dark:hover:text-white transition border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 lg:p-8"
              >
                <div className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 p-4 rounded-full mb-3 transition">
                  <Upload className="size-[20px] lg:size-[28px] text-gray-600 dark:text-zinc-200" />
                </div>
                <p className="text-[10px] md:text-sm text-gray-700 dark:text-gray max-w-xl leading-relaxed text-center">
                  To upload a new document, select your <b>.docx</b> file and
                  click <b>Upload.</b> Existing files with the same name will be
                  overwritten.
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="mt-3 text-sm text-gray-600 dark:text-zinc-300 bg-white dark:bg-black border dark:border-zinc-800 py-2 px-4 rounded-md">
                  Selected file: <b className="dark:text-white">{file.name}</b>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 lg:gap-4 mt-5 lg:mt-8">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={uploadCertificatePending}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-700 dark:text-gray hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || uploadCertificatePending}
              className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadCertificatePending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
