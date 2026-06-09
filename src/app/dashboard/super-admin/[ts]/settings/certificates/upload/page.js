"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { uploadCertification } from "@/hooks/api/dashboardApi";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BackButton from "@/components/common/BackButton";

const Page = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = e => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const {
    mutate: uploadCertificateMutation,
    isPending: uploadCertificatePending,
  } = uploadCertification();

  const handleUpload = () => {
    if (!file) {
      return Swal.fire({
        text: "Please select a file first.",
        icon: "error",
      });
    }

    const formData = new FormData();

    formData.append("file", file);

    uploadCertificateMutation(formData, {
      onSuccess: data => {
        setFile(null);
        toast.success(data?.message || "Certificate uploaded successfully");
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title={"Upload Certificate"} />

      <div className="px-1.5 py-3 min-[374px]:p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        <div className="w-full flex justify-center">
          <div className="w-full bg-neutral-50 dark:bg-neutral-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 lg:p-8 text-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center text-gray-500 dark:text-gray hover:text-gray-700 dark:hover:text-white transition"
            >
              <div className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 p-4 rounded-full mb-3 transition">
                <Upload className="size-[20px] lg:size-[28px] text-gray-600 dark:text-zinc-200" />
              </div>
              <p className="text-[10px] md:text-sm text-gray-700 dark:text-gray max-w-xl leading-relaxed">
                To upload a new certificate, select your <b>.docx</b> file and
                click
                <b> Upload</b>. Existing files with the same name will be
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
              <div className="mt-4 text-sm text-gray-600 dark:text-zinc-300 bg-white dark:bg-black border dark:border-zinc-800 py-2 px-4 rounded-md inline-block">
                Selected file: <b className="dark:text-white">{file.name}</b>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-8">
              <BackButton />
              <Button
                onClick={handleUpload}
                disabled={!file || uploadCertificatePending}
                className={`bg-brown dark:bg-dark-brown hover:bg-brown text-white px-8 ${
                  file && !uploadCertificatePending
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
              >
                {uploadCertificatePending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
