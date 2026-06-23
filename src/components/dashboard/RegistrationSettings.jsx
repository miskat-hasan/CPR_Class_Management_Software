"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";

import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});
import { useForm } from "react-hook-form";

const RegistrationSettings = () => {
  const sharedNotesRef = useRef(null);
  const internalNotesRef = useRef(null);
  const form = useForm({
    defaultValues: {},
  });

  const onSubmit = (values) => {
    const sharedNotes = sharedNotesRef.current?.getContent();
    const internalNotes = internalNotesRef.current?.getContent();

    const finalData = {
      ...values,
      sharedNotes,
      internalNotes,
    };
  };
  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SectionTitle title={"Basic Site Settings"} />
        <FormContainer form={form} onSubmit={onSubmit}>
          <FormInput
            name="siteName"
            label="Site Name"
            placeholder="Site Name Here"
          />
          {/* <FormInput
            name="Schedule Page Format"
            label="Schedule Page Format"
            placeholder="Schedule Page Format Here"
          /> */}

          <div className="flex flex-col gap-2 my-2 lg:my-4">
            <p className="font-semibold text-[15px] text-gray-700">Options</p>
            <p className="flex items-center gap-2 text-[12px] sm:text-sm">
              https://codeblueservices.enrollware.com{" "}
            </p>
            <p className="flex items-center gap-2 text-[12px] sm:text-sm">
              https://codeblueservices.enrollware.com{" "}
            </p>
            <p className="flex items-center gap-2 text-[12px] sm:text-sm">
              https://codeblueservices.enrollware.com{" "}
            </p>
            <p className="flex items-center gap-2 text-[12px] sm:text-sm">
              https://codeblueservices.enrollware.com{" "}
            </p>
          </div>

          <div>
            <h6 className="leading-[1.45] mb-2.5 font-medium text-base">
              Shared Notes
            </h6>
            <RichTextEditor ref={sharedNotesRef} />
          </div>
          <div>
            <h6 className="leading-[1.45] mb-2.5 font-medium text-base">
              Internal Notes
            </h6>
            <RichTextEditor ref={internalNotesRef} />
          </div>

          <FormInput
            name="Check-in Password"
            label="Check-in Password"
            placeholder="Check-in Password Here"
          />
          <FormInput
            name="Check-in Link"
            label="Check-in Link"
            placeholder="Check-in Link Here"
          />

          <div className="flex items-center justify-end">
            <div className="flex justify-end gap-4 mt-4 lg:mt-8">
              <Button
                type="button"
                className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50 focus:outline-none"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown cursor hover:bg-brown  focus:outline-none"
              >
                Update Settings
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default RegistrationSettings;
