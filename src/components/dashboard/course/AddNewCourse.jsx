"use client";

import BackButton from "@/components/common/BackButton";
import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  getAllCardType,
  getAllDiscipline,
  getAllKeyCodeBank,
  getAllProductAddOns,
  getCourseImage,
  getSecondCardType,
  storeCourse,
} from "@/hooks/api/dashboardApi";
import { LucideTrash2, X } from "lucide-react";

import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

const AddNewCourse = () => {
  const descriptionRef = useRef(null);
  const emailBodyRef = useRef(null);

  const form = useForm({
    defaultValues: {
      course_name: "",
      mode: "on-site",
      discipline: "",
      deposit_registration: false,
      multiple_pricing: false,
      deposit_amounts: "",
      price: "",
      price_level_prompt: "",
      addonPrompt: "",
      add_ons: [],
      shipping_price: "",
      keycode_bank: "",
      course_certifying_body: "none",
      courseSKUs: "",
      cardType: "",
      secondCardType: "",
      course_image: "",
      upload_image: null,
      selected_option_ids: [],
      ceu_credits: "",
      courseConfirmationEmailCCS: "",
      courseConfirmationEmailSubject: "",
      payloadConfirmationEmailSubject: "",
      use_email_for_payments: false,
      enable_seo: false,
      seoDescription: "",
      priceLevel: [
        { price: "", code: "", description: "" },
        { price: "", code: "", description: "" },
      ],
    },
  });

  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = form;

  const watchFields = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceLevel",
  });

  const { mutate: storeCourseMutation, isPending: storeCoursePending } =
    storeCourse();

  const { data: disciplineData, isLoading: disciplineLoading } =
    getAllDiscipline();
  const { data: addOnsData, isLoading: addOnsDataLoading } =
    getAllProductAddOns();
  const { data: keyCodeBank, isLoading: keyCodeBankLoading } =
    getAllKeyCodeBank();
  const { data: cardTypeData, isLoading: cardTypeDataLoading } =
    getAllCardType();
  const { data: secondCardTypeData, isLoading: secondCardTypeDataLoading } =
    getSecondCardType();
  const { data: courseImageData, isLoading: courseImageDataLoading } =
    getCourseImage();

  const imagePreview = courseImageData?.data?.data?.find(
    item => Number(item?.id) === Number(watchFields?.course_image),
  );

  const handleAddPriceLevel = () => {
    append({ price: "", code: "", description: "" });
  };

  const handleRemovePriceLevel = index => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const handleAddAddOns = value => {
    const addOnsId = typeof value === "object" ? value?.id : value;
    const numericId = Number(addOnsId);

    if (numericId && !watchFields?.add_ons?.includes(numericId)) {
      setValue("add_ons", [...(watchFields?.add_ons || []), numericId]);
    }
  };

  const handleRemoveAddOns = addOnsId => {
    const numericId = Number(addOnsId);
    setValue(
      "add_ons",
      watchFields?.add_ons?.filter(id => Number(id) !== numericId),
    );
  };

  const availableAddOns = addOnsData?.data?.data?.filter(
    item => !watchFields?.add_ons?.includes(Number(item.id)),
  );

  const onSubmit = data => {
    const description = descriptionRef.current?.getContent();
    const emailBody = emailBodyRef.current?.getContent();

    const formData = new FormData();

    formData.append("course_name", data.course_name || "");
    formData.append("mode", data.mode || "on-site");
    formData.append("discipline", data.discipline || "");

    formData.append("allow_deposit", data.deposit_registration ? "1" : "0");
    formData.append("allow_multiple", data.multiple_pricing ? "1" : "0");

    if (data.deposit_registration) {
      formData.append("deposit_amount", data.deposit_amounts || "");
    }

    if (data.multiple_pricing) {
      data.priceLevel?.forEach((level, index) => {
        formData.append(
          `multiple_price[${index}][price_level_prompt]`,
          data.price_level_prompt || "",
        );
        formData.append(`multiple_price[${index}][price]`, level.price || "");
        formData.append(`multiple_price[${index}][code]`, level.code || "");
        formData.append(
          `multiple_price[${index}][description]`,
          level.description || "",
        );
      });
    } else {
      formData.append("price", data.price || "");
    }

    formData.append("prompt", data.addonPrompt || "");
    data.add_ons?.forEach(id => {
      formData.append("selected_addons[]", id);
    });

    formData.append("shipping_price", data.shipping_price || "");
    formData.append("keycode_bank_id", data.keycode_bank || "");
    formData.append("training_site_id", "1");

    let certifyingBody = "none";
    if (data.course_certifying_body === "American Red Cross") {
      certifyingBody = "american_red_cross";
    } else if (data.course_certifying_body === "American Heart Association") {
      certifyingBody = "american_heart_association";
    }
    formData.append("course_certifying_body", certifyingBody);

    if (certifyingBody === "american_red_cross") {
      formData.append("course_skus", data.courseSKUs || "");
    }
    if (certifyingBody === "american_heart_association") {
      formData.append("card_type_id", data.cardType || "");
      formData.append("second_card_type_id", data.secondCardType || "");
    }

    if (data.upload_image) {
      formData.append("image", data.upload_image);
    } else {
      formData.append("course_image_id", data.course_image || "");
    }

    (data.selected_option_ids || []).forEach(optionId => {
      formData.append("selected_options[]", optionId);
    });

    formData.append("ecu_credits", data.ceu_credits || "");
    formData.append("description", description || "");
    formData.append("email_body", emailBody || "");

    formData.append(
      "confirmation_email",
      data.courseConfirmationEmailCCS || "",
    );
    formData.append(
      "course_confirmation_email_subject",
      data.courseConfirmationEmailSubject || "",
    );
    formData.append(
      "payment_confirmation_email_subject",
      data.payloadConfirmationEmailSubject || "",
    );
    formData.append(
      "use_general_email_body",
      data.use_email_for_payments ? "1" : "0",
    );

    formData.append("seo_rich_results", data.enable_seo ? "1" : "0");
    if (data.enable_seo) {
      formData.append("seo_description", data.seoDescription || "");
    }

    storeCourseMutation(formData, {
      onSuccess: res => {
        toast.success(res?.message || "Course created successfully");
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add Course Type" />

      <div className="px-1.5 py-3 min-[374px]:p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-3 lg:gap-6">
            <FormInput
              name="course_name"
              label="Course Name"
              placeholder="Course name here"
            />

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[15px] text-gray-700 dark:text-gray">
                Mode
              </p>
              <div className="flex flex-col gap-2 dark:text-gray">
                {["on-site", "blended", "online"].map(mode => (
                  <label
                    key={mode}
                    className="flex items-center gap-2 text-sm cursor-pointer w-fit"
                  >
                    <input
                      type="radio"
                      value={mode}
                      {...register("mode")}
                      className="accent-brown"
                    />
                    {mode.charAt(0).toUpperCase() +
                      mode.slice(1).replace("-", " ")}
                    :{" "}
                    {mode === "on-site"
                      ? "The course is taught in person at a physical location."
                      : mode === "blended"
                        ? "The course has both online and in-person components."
                        : "All class instruction, assignments, and tests are asynchronous and can be completed virtually."}
                  </label>
                ))}
              </div>
            </div>

            <Controller
              name="discipline"
              control={control}
              rules={{ required: "Discipline is required" }}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="discipline"
                  label="Discipline"
                  placeholder="Select Discipline"
                  isLoading={disciplineLoading}
                  options={disciplineData?.data?.data}
                  error={errors.discipline?.message}
                />
              )}
            />

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[15px] text-gray-700 dark:text-gray">
                Price Options
              </p>
              <div className="flex flex-col gap-2 dark:text-gray">
                <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                  <input
                    {...register("deposit_registration")}
                    type="checkbox"
                    className="accent-brown"
                  />
                  Allow registrations with a deposit
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                  <input
                    {...register("multiple_pricing")}
                    type="checkbox"
                    className="accent-brown"
                  />
                  Allow multiple pricing levels
                </label>
              </div>
            </div>

            {watchFields.deposit_registration && (
              <FormInput
                name="deposit_amounts"
                label="Deposit Amount"
                placeholder="$0.00"
              />
            )}

            {watchFields.multiple_pricing ? (
              <div>
                <FormTextarea
                  name="price_level_prompt"
                  label="Price Level Prompt"
                  rows={3}
                />
                <div className="bg-neutral-50 dark:bg-zinc-900 border dark:border-zinc-800 px-1 sm:px-2 pt-2 pb-4 rounded-md mt-3">
                  <h6 className="text-lg mb-1 dark:text-white">Price Levels</h6>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-1 sm:gap-4 mt-3"
                    >
                      <div className="grid grid-cols-2 gap-[2px] sm:gap-2 flex-1">
                        <div className="flex gap-[2px] sm:gap-2">
                          <FormInput
                            name={`priceLevel.${index}.price`}
                            placeholder="Price"
                            className={"text-[13px] rounded-sm px-1"}
                          />
                          <FormInput
                            name={`priceLevel.${index}.code`}
                            placeholder="Code"
                            className={"text-[13px] rounded-sm px-1"}
                          />
                        </div>
                        <FormInput
                          name={`priceLevel.${index}.description`}
                          placeholder="Description"
                          className={"text-[13px] rounded-sm px-1"}
                        />
                      </div>
                      {fields.length > 2 && (
                        <div
                          onClick={() => handleRemovePriceLevel(index)}
                          className="bg-neutral-200 dark:bg-zinc-800 p-1 sm:p-2 rounded sm:rounded-md cursor-pointer hover:bg-neutral-300 dark:hover:bg-zinc-700 text-neutral-800 dark:text-neutral-200"
                        >
                          <LucideTrash2 className="size-[14px] sm:size-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    onClick={handleAddPriceLevel}
                    className="mt-4 px-2 py-1.5 inline-flex items-center gap-1 border dark:border-zinc-700 rounded-md text-sm bg-neutral-700 text-neutral-100 cursor-pointer hover:bg-neutral-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    <FaPlus className="size-3" /> Add more
                  </div>
                </div>
              </div>
            ) : (
              <FormInput name="price" label="Price" placeholder="Price" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextarea
                name="addonPrompt"
                label="Add-on Prompt"
                placeholder="Prompt text for add-ons..."
              />
              <div className="flex flex-col gap-2">
                <Controller
                  name="add_ons_selector"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="add_ons_selector"
                      label="Add-ons"
                      placeholder="Select Add-ons"
                      isLoading={addOnsDataLoading}
                      options={availableAddOns}
                      onChange={value => {
                        if (value) {
                          handleAddAddOns(value);
                          field.onChange("");
                        }
                      }}
                      value=""
                    />
                  )}
                />
                {watchFields.add_ons?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {watchFields.add_ons.map(id => {
                      const addon = addOnsData?.data?.data?.find(
                        a => Number(a.id) === id,
                      );
                      return (
                        <div
                          key={id}
                          className="inline-flex items-center gap-1 bg-neutral-200 dark:bg-zinc-800 text-neutral-800 dark:text-neutral-200 px-3 py-1 rounded-full text-sm"
                        >
                          {addon?.name || `Add-on #${id}`}
                          <button
                            type="button"
                            onClick={() => handleRemoveAddOns(id)}
                            className="hover:bg-neutral-300 dark:hover:bg-zinc-700 rounded-full p-0.5"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                name="shipping_price"
                label="Shipping Price"
                placeholder="0.00"
              />
              <Controller
                name="keycode_bank"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    label="Keycode Bank"
                    placeholder="Select keycode bank"
                    isLoading={keyCodeBankLoading}
                    options={keyCodeBank?.data?.data}
                    error={errors.keycode_bank?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="course_certifying_body"
                control={control}
                rules={{ required: "Course Certifying Body is required" }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    label="Course Certifying Body"
                    placeholder="Select certifying body"
                    options={[
                      { id: "none", name: "None" },
                      { id: "American Red Cross", name: "American Red Cross" },
                      {
                        id: "American Heart Association",
                        name: "American Heart Association",
                      },
                    ]}
                    error={errors.course_certifying_body?.message}
                  />
                )}
              />

              {watchFields.course_certifying_body === "American Red Cross" && (
                <Controller
                  name="courseSKUs"
                  control={control}
                  rules={{ required: "Course SKUs is required for ARC" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      label="Course SKUs"
                      placeholder="Select SKU"
                      options={cardTypeData?.data?.data}
                      error={errors.courseSKUs?.message}
                    />
                  )}
                />
              )}
            </div>

            {watchFields.course_certifying_body ===
              "American Heart Association" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="cardType"
                  control={control}
                  rules={{ required: "Card Type is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      label="Card Type"
                      placeholder="Select card type"
                      options={cardTypeData?.data?.data}
                      error={errors.cardType?.message}
                    />
                  )}
                />
                <Controller
                  name="secondCardType"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      label="Second Card Type"
                      placeholder="Select second card type"
                      options={secondCardTypeData?.data?.data}
                      error={errors.secondCardType?.message}
                    />
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <Controller
                  name="course_image"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      label="Course Image"
                      placeholder="Select course image"
                      isLoading={courseImageDataLoading}
                      options={courseImageData?.data?.data}
                      onChange={val => {
                        field.onChange(val);
                        setValue("upload_image", null);
                      }}
                      error={errors.course_image?.message}
                    />
                  )}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray">
                    Or Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm w-fit file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-neutral-100 dark:file:bg-zinc-800 dark:file:text-zinc-200 file:text-neutral-800 hover:file:bg-neutral-200 dark:hover:file:bg-zinc-700 dark:text-gray cursor-pointer"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue("upload_image", file);
                        setValue("course_image", "");
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray mb-2">
                  Preview
                </label>
                {watchFields.upload_image ? (
                  <Image
                    src={URL.createObjectURL(watchFields.upload_image)}
                    width={120}
                    height={120}
                    alt="Upload preview"
                    className="object-cover rounded border dark:border-zinc-800"
                  />
                ) : watchFields.course_image && imagePreview?.image ? (
                  <Image
                    src={imagePreview.image}
                    width={120}
                    height={120}
                    alt="Course preview"
                    className="object-cover rounded border dark:border-zinc-800"
                  />
                ) : (
                  <div className="w-26 h-26 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded flex items-center text-center justify-center text-gray-400 dark:text-zinc-500 text-sm">
                    No image selected
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[15px] text-gray-700 dark:text-gray">
                Options
              </p>
              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  type="checkbox"
                  value={"prompt_for_certification"}
                  className="accent-brown"
                  {...register("prompt_for_certification")}
                />
                prompt for certification
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  type="checkbox"
                  value={"prompt_for_certification"}
                  className="accent-brown"
                  {...register("prompt_for_certification")}
                />
                prompt for certification
              </label>
            </div>

            <FormInput
              name="ceu_credits"
              label="CEU Credits"
              placeholder="e.g. 8.0"
            />

            <div>
              <h5 className="font-medium text-base mb-2 dark:text-white">
                Description
              </h5>
              <RichTextEditor ref={descriptionRef} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                name="courseConfirmationEmailCCS"
                label="Confirmation Email CC"
                placeholder="email1@example.com, email2@example.com"
              />
              <FormInput
                name="courseConfirmationEmailSubject"
                label="Confirmation Email Subject"
                placeholder="Your Course Registration Confirmation"
              />
            </div>

            <FormInput
              name="payloadConfirmationEmailSubject"
              label="Payment Confirmation Email Subject"
              placeholder="Payment Received - Course Enrollment"
            />

            <div>
              <h5 className="font-medium text-base mb-2 dark:text-white">
                Course Confirmation Email Body
              </h5>
              <RichTextEditor ref={emailBodyRef} />
            </div>

            <div className="dark:text-gray">
              <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                  {...register("use_email_for_payments")}
                  type="checkbox"
                  className="accent-brown"
                />
                Use the same email body for payments / general registrations
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <BackButton />
              <Button
                type="submit"
                disabled={storeCoursePending}
                className="bg-brown dark:bg-dark-brown hover:bg-brown text-white px-8 cursor-pointer dark:hover:bg-brown"
              >
                {storeCoursePending ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default AddNewCourse;
