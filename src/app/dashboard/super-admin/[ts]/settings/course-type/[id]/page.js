"use client";

import SectionTitle from "@/components/common/SectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  getAllCardType,
  getAllCourses,
  getAllDiscipline,
  getAllKeyCodeBank,
  getAllProductAddOns,
  getCourseImage,
  getCourseOptions,
  getSecondCardType,
  getSingleCourse,
  updateCourse,
} from "@/hooks/api/dashboardApi";
import { LucideTrash2, X } from "lucide-react";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import Swal from "sweetalert2";

const RichTextEditor = dynamic(() => import("@/components/shared/RichEditor"), {
  ssr: false,
});

const Page = ({ params }) => {
  const { id } = params;

  const descriptionRef = useRef(null);
  const emailBodyRef = useRef(null);

  const form = useForm({
    defaultValues: {
      course_name: "",
      mode: "",
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
      course_certifying_body: "",
      courseSKUs: "",
      cardType: "",
      secondCardType: "",
      course_image: "",
      upload_image: null,
      selected_options: [],
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
    reset,
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

  const { data: courseData } = getSingleCourse(id);
  const { mutate: updateCourseMutation, isPending: updateCoursePending } =
    updateCourse();

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
  const { data: courseOptionData, isLoading: courseOptionDataLoading } =
    getCourseOptions();

  const imagePreview = courseImageData?.data?.data?.find(
    (item) => Number(item?.id) === Number(watchFields?.course_image),
  );

  useEffect(() => {
    if (
      courseData?.data ||
      disciplineData?.data?.data ||
      addOnsData?.data?.data ||
      keyCodeBank?.data?.data ||
      cardTypeData?.data?.data ||
      secondCardTypeData?.data?.data ||
      courseImageData?.data?.data ||
      courseOptionData?.data?.data
    ) {
      const course = courseData?.data;

      reset({
        course_name: course?.course_name || "",
        mode: course?.mode === "onsite" ? "on-site" : course?.mode || "on-site",
        discipline: course?.discipline || "",

        deposit_registration: !!course?.allow_deposit,
        deposit_amounts: course?.deposit_amount || "",
        multiple_pricing: !!course?.allow_multiple,

        price: course?.price || "",
        price_level_prompt: course?.deposits?.[0]?.price_level_prompt || "",
        priceLevel:
          course?.allow_multiple && course?.deposits?.length > 0
            ? course?.deposits.map((dep) => ({
                price: dep.price_levels?.price?.toString() || "",
                code: dep.price_levels?.code || "",
                description: dep.price_levels?.description || "",
              }))
            : [
                { price: "", code: "", description: "" },
                { price: "", code: "", description: "" },
              ],

        addonPrompt: course?.prompt || "",
        add_ons: course?.addons?.map((addon) => Number(addon.id)) || [],

        shipping_price: course?.shipping_price?.toString() || "",
        keycode_bank: course?.keycode_bank_id || "",

        course_certifying_body:
          course?.course_certifying_body === "american_red_cross"
            ? "American Red Cross"
            : course?.course_certifying_body === "american_heart_association"
              ? "American Heart Association"
              : "none",

        courseSKUs: course?.course_skus || "",
        cardType: course?.card_type_id?.toString() || "",
        secondCardType: course?.second_card_type_id?.toString() || "",

        course_image: course?.course_image_id || "",
        upload_image: null,

        selected_options: course?.options?.map((opt) => Number(opt.id)) || [],

        ceu_credits: course?.ecu_credits || "",

        courseConfirmationEmailCCS: course?.confirmation_email || "",
        courseConfirmationEmailSubject:
          course?.course_confirmation_email_subject || "",
        payloadConfirmationEmailSubject:
          course?.payment_confirmation_email_subject || "",
        use_email_for_payments: !!course?.use_general_email_body,

        enable_seo: !!course?.seo_rich_results,
        seoDescription: course?.seo_description || "",
      });

      if (descriptionRef.current) {
        descriptionRef.current.setContents(course?.description || "");
      }
      if (emailBodyRef.current) {
        emailBodyRef.current.setContents(course?.email_body || "");
      }
    }
  }, [
    courseData?.data,
    reset,
    disciplineData?.data?.data,
    addOnsData?.data?.data,
    keyCodeBank?.data?.data,
    cardTypeData?.data?.data,
    secondCardTypeData?.data?.data,
    courseImageData?.data?.data,
    courseOptionData?.data?.data,
  ]);

  const handleAddPriceLevel = () => {
    append({ price: "", code: "", description: "" });
  };

  const handleRemovePriceLevel = (index) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const handleAddAddOns = (value) => {
    const addOnsId = typeof value === "object" ? value?.id : value;
    const numericId = Number(addOnsId);

    if (numericId && !watchFields?.add_ons?.includes(numericId)) {
      setValue("add_ons", [...(watchFields?.add_ons || []), numericId]);
    }
  };

  const handleRemoveAddOns = (addOnsId) => {
    const numericId = Number(addOnsId);
    setValue(
      "add_ons",
      watchFields?.add_ons?.filter((id) => Number(id) !== numericId),
    );
  };

  const availableAddOns = addOnsData?.data?.data?.filter(
    (item) => !watchFields?.add_ons?.includes(Number(item.id)),
  );

  const onSubmit = (data) => {
    const description = descriptionRef.current?.getContent();
    const emailBody = emailBodyRef.current?.getContent();

    const formData = new FormData();

    formData.append("id", id);
    formData.append("course_name", data.course_name || "");
    formData.append("mode", data.mode || "");
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
    data.add_ons?.forEach((id) => {
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

    (data.selected_options || []).forEach((optionId) => {
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

    updateCourseMutation(formData, {
      onSuccess: (res) => {
        toast.success(res?.message || "Course updated successfully");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Add / Edit Course Type" />

      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-3 lg:gap-6">
            <FormInput
              name="course_name"
              label="Course Name"
              placeholder="Course name here"
            />

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[15px] text-gray-700">Mode</p>
              <div className="flex flex-col gap-2">
                {["on-site", "blended", "online"].map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      value={m}
                      {...register("mode")}
                      className="accent-brown"
                    />
                    {m === "on-site"
                      ? "On-site"
                      : m === "blended"
                        ? "Blended"
                        : "Online"}
                    :{" "}
                    {m === "on-site"
                      ? "The course is taught in person at a physical location."
                      : m === "blended"
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
              <p className="font-semibold text-[15px] text-gray-700">
                Price Options
              </p>
              <label className="flex items-center gap-2 text-[12px] sm:text-sm">
                <input
                  {...register("deposit_registration")}
                  type="checkbox"
                  className="accent-brown"
                />
                Allow registrations with a deposit
              </label>
              <label className="flex items-center gap-2 text-[12px] sm:text-sm">
                <input
                  {...register("multiple_pricing")}
                  type="checkbox"
                  className="accent-brown"
                />
                Allow multiple pricing levels
              </label>
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
                <div className="bg-neutral-50 border px-2 pt-2 pb-4 rounded-md mt-3">
                  <h6 className="text-lg mb-1">Price Levels</h6>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-4 mt-3"
                    >
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <FormInput
                            name={`priceLevel.${index}.price`}
                            placeholder="Price"
                          />
                          <FormInput
                            name={`priceLevel.${index}.code`}
                            placeholder="Code"
                          />
                        </div>
                        <FormInput
                          name={`priceLevel.${index}.description`}
                          placeholder="Description"
                        />
                      </div>
                      {fields.length > 2 && (
                        <div
                          onClick={() => handleRemovePriceLevel(index)}
                          className="bg-neutral-200 p-2 rounded-md cursor-pointer hover:bg-neutral-300"
                        >
                          <LucideTrash2 className="size-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    onClick={handleAddPriceLevel}
                    className="mt-4 px-2 py-1.5 inline-flex items-center gap-1 border rounded-md text-sm bg-neutral-700 text-neutral-100 cursor-pointer hover:bg-neutral-600 shadow-sm"
                  >
                    <FaPlus className="size-3" /> Add more
                  </div>
                </div>
              </div>
            ) : (
              <FormInput name="price" label="Price" placeholder="Price" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <FormTextarea
                name="addonPrompt"
                label="Add-on Prompt"
                placeholder="Prompt"
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
                      onChange={(value) => {
                        if (value) {
                          handleAddAddOns(value);
                          field.onChange("");
                        }
                      }}
                      value=""
                      className="flex-1"
                    />
                  )}
                />
                {watchFields.add_ons?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {watchFields.add_ons.map((id) => {
                      const addon = addOnsData?.data?.data?.find(
                        (item) => Number(item.id) === Number(id),
                      );
                      return (
                        <div
                          key={id}
                          className="inline-flex items-center gap-1 bg-neutral-200 text-neutral-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{addon?.name || `Add-on ${id}`}</span>
                          <div
                            onClick={() => handleRemoveAddOns(id)}
                            className="hover:bg-neutral-300 rounded-full p-0.5 cursor-pointer"
                          >
                            <X className="size-3" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <FormInput
                name="shipping_price"
                label="Shipping Price"
                placeholder="Shipping Price"
              />
              <Controller
                name="keycode_bank"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="keycode_bank"
                    label="Use Keycode Bank"
                    placeholder="Click to select"
                    isLoading={keyCodeBankLoading}
                    options={keyCodeBank?.data?.data}
                    error={errors.keycode_bank?.message}
                    className="flex-1"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <Controller
                name="course_certifying_body"
                control={control}
                rules={{ required: "Course Certifying Body is required" }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="courseCertifyingBody"
                    label="Course Certifying Body"
                    placeholder="Choose body"
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
                  rules={{ required: "Course SKUs is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="courseSKUs"
                      label="Course SKUs"
                      placeholder="Course SKUs"
                      options={cardTypeData?.data?.data}
                      error={errors.courseSKUs?.message}
                    />
                  )}
                />
              )}
            </div>

            {watchFields.course_certifying_body ===
              "American Heart Association" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <Controller
                  name="cardType"
                  control={control}
                  rules={{ required: "Card Type is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="cardType"
                      label="Card Type"
                      placeholder="Choose type"
                      options={cardTypeData?.data?.data}
                      error={errors.cardType?.message}
                    />
                  )}
                />
                <Controller
                  name="secondCardType"
                  control={control}
                  rules={{ required: "Second Card Type is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="secondCardType"
                      label="Second Card Type"
                      placeholder="Choose type"
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
                      id="image"
                      label="Image"
                      placeholder="Image URL or upload"
                      isLoading={courseImageDataLoading}
                      options={courseImageData?.data?.data}
                      onChange={(val) => {
                        field.onChange(val);
                        setValue("upload_image", null);
                      }}
                      error={errors.course_image?.message}
                    />
                  )}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Or Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-neutral-100 hover:file:bg-neutral-200 cursor-pointer"
                    onChange={(e) => {
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
                <label className="text-sm sm:text-base font-medium text-gray-700 block mb-2">
                  Preview
                </label>
                {watchFields.upload_image ? (
                  <Image
                    src={URL.createObjectURL(watchFields.upload_image)}
                    width={100}
                    height={100}
                    alt="Upload preview"
                    className="object-cover rounded border"
                  />
                ) : watchFields.course_image && imagePreview?.image ? (
                  <figure className="border rounded-md overflow-hidden w-fit">
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_SITE_URL +
                        "/" +
                        imagePreview?.image
                      }
                      width={100}
                      height={100}
                      alt="Course preview"
                      className="object-cover"
                    />
                  </figure>
                ) : (
                  <div className="w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[15px] text-gray-700">Options</p>
              <div className="grid grid-cols-2 gap-2 text-gray-700 max-w-[1400px]">
                {courseOptionData?.data?.data?.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 text-[12px] sm:text-sm"
                  >
                    <Controller
                      name="selected_options"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value?.includes(option.id)}
                          onChange={(e) => {
                            const updatedOptions = e.target.checked
                              ? [...(field.value || []), option.id]
                              : (field.value || []).filter(
                                  (id) => id !== option.id,
                                );
                            field.onChange(updatedOptions);
                          }}
                          className="accent-brown"
                        />
                      )}
                    />
                    {option.title}
                  </label>
                ))}
              </div>
            </div>

            <FormInput
              name="ceu_credits"
              label="CEU Credits"
              placeholder="Enter CEU credits"
            />

            <div>
              <h6 className="leading-[1.45] mb-2.5 font-medium text-base">
                Description
              </h6>
              <RichTextEditor ref={descriptionRef} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <FormInput
                name="courseConfirmationEmailCCS"
                label="Course Confirmation Email CCS"
                placeholder="Email addresses"
              />
              <FormInput
                name="courseConfirmationEmailSubject"
                label="Course Confirmation Email Subject"
                placeholder="Subject line"
              />
            </div>

            <FormInput
              name="payloadConfirmationEmailSubject"
              label="Payment Confirmation Email Subject"
              placeholder="Subject line"
            />

            <div>
              <h6 className="leading-[1.45] mb-2.5 font-medium text-base">
                Course Confirmation Email Body
              </h6>
              <RichTextEditor ref={emailBodyRef} />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                {...register("use_email_for_payments")}
                type="checkbox"
                className="accent-brown"
              />
              Use the above email body for class registrations and general
              payments
            </label>

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[15px] text-gray-700">
                SEO & Rich Results
              </p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  {...register("enable_seo")}
                  type="checkbox"
                  className="accent-brown"
                />
                Enable
              </label>
            </div>

            {watchFields.enable_seo && (
              <FormTextarea
                name="seoDescription"
                label="SEO-friendly description (recommended: 240 chars, max: 500)"
                placeholder="An SEO-friendly description..."
                rows={4}
              />
            )}

            <div className="flex items-center justify-end">
              <div className="flex justify-end gap-4 mt-4 lg:mt-8">
                <Button asChild type="button" variant="outline">
                  <Link href="../course_type">Back</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={updateCoursePending}
                  className="bg-brown dark:bg-dark-brown hover:bg-brown  text-white"
                >
                  {updateCoursePending ? "Saving..." : "Save Course"}
                </Button>
              </div>
            </div>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default Page;