"use client";

import CustomSelect from "@/components/shared/form/CustomSelect";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import {
  getAllCountry,
  getEnrollmentDetails,
  useStudentEnrollment,
} from "@/hooks/api/dashboardApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const { id } = useParams("id");

  const router = useRouter();
  const [isEnrollmentFormOpen, setIsEnrollmentFormOpen] = useState(false);

  const form = useForm();

  const {
    control,
    reset,
    register,
    formState: { errors },
  } = form;

  const { data: countryData, isLoading: countryDataLoading } = getAllCountry();

  // class & course data
  const { data, isLoading } = getEnrollmentDetails(id);

  // student enrollment mutation
  const { mutate, isPending } = useStudentEnrollment(id);

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email_address);
    formData.append("confirm_email", data.confirm_email_address);
    formData.append("primary_phone", data.mobile_phone);
    formData.append("alternate_phone", data.alternate_phone);
    formData.append("address_1", data.address_1);
    formData.append("address_2", data.address_2);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("zip", data.zip_code);
    formData.append("country_id", data.country);

    formData.append("promo_code", data.promo_code);
    // formData.append("billing_same_as_mailing", !data.new_billing_address);
    formData.append(
      "receive_text_messages",
      data.receive_text_message === "yes",
    );
    formData.append("how_did_you_hear", data.how_did_you_hear);
    formData.append(
      "instructor_interest_notes",
      data.instructor_interest_notes,
    );

    mutate(formData, {
      onSuccess: (data) => {
        reset();
        toast.success(data?.message);
        router.push(`${id}/payment`);
      },
    });
  };
  return (
    <div className="flex gap-5 bg-white dark:bg-black p-4 rounded-2xl border">
      <div className="basis-2/3">
        <h2 className="border-b text-xl font-medium mb-1">Class Enrollment</h2>
        {!isEnrollmentFormOpen ? (
          <>
            <div className="flex gap-4 my-4">
              <div>
                <img
                  src="https://codeblueservices.enrollware.com/cmsfiles/books/heartsaver-cpr.jpg"
                  alt=""
                />
              </div>
              <div className="max-w-3xl border border-gray-300">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-300">
                  <h2 className="font-semibold text-lg uppercase">
                    {data?.data?.class_details?.course?.course_name}
                  </h2>
                </div>
                <div className="divide-y divide-gray-300">
                  <div className="grid grid-cols-3">
                    <div className="bg-gray-100 px-4 py-3 font-semibold border-r border-gray-300">
                      Date/Time:
                    </div>
                    <div className="col-span-2 px-4 py-3 text-sm">
                      {data?.data?.class_details?.class_times?.map(
                        (item, index) => (
                          <div key={index} className="">
                            {item?.date} from {item?.from} to {item?.to}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="bg-gray-100 px-4 py-3 font-semibold border-r border-gray-300">
                      Location:
                    </div>
                    <div className="col-span-2 px-4 py-3 leading-relaxed">
                      {data?.data?.class_details?.training_site?.address_line_1}
                      ,{" "}
                      {data?.data?.class_details?.training_site?.address_line_2}
                      , {data?.data?.class_details?.training_site?.city},{" "}
                      {data?.data?.class_details?.training_site?.state_province}
                      , {data?.data?.class_details?.training_site?.postal_code},{" "}
                      {data?.data?.class_details?.training_site?.country}
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="bg-gray-100 px-4 py-3 font-semibold border-r border-gray-300">
                      Class Price:
                    </div>
                    <div className="col-span-2 px-4 py-3">
                      ${data?.data?.class_details?.price}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center my-4">
              <button
                onClick={() => setIsEnrollmentFormOpen(true)}
                className="border bg-neutral-100 cursor-pointer hover:bg-neutral-200 rounded-md px-3 py-1.5"
              >
                Continue with Registration
              </button>
            </div>
          </>
        ) : (
          <div>
            <p className="text-sm my-4">
              Please complete the following form to reserve your space in this
              class. You will have an opportunity to review and edit your
              information after submitting this page.
            </p>
            <FormContainer form={form} onSubmit={onSubmit}>
              <h6 className="text-xl font-medium mb-1">Class Information</h6>
              <div className="col-span-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
                <div className="space-y-1">
                  <p className="flex items-center text-sm">
                    <div className="leading-[1.45] font-medium text-sm sm:text-base text-gray-700 w-[150px]">
                      Course:{" "}
                    </div>
                    {data?.data?.class_details?.course?.course_name}
                  </p>
                  <p className="flex items-center text-sm">
                    <div className="leading-[1.45] font-medium text-sm sm:text-base text-gray-700 w-[150px]">
                      Date/Time:
                    </div>{" "}
                    <div className="col-span-2 text-sm">
                      {data?.data?.class_details?.class_times?.map(
                        (item, index) => (
                          <div key={index} className="">
                            {item?.date} from {item?.from} to {item?.to}
                          </div>
                        ),
                      )}
                    </div>
                  </p>
                  <p className="flex items-center text-sm">
                    <div className="leading-[1.45] font-medium text-sm sm:text-base text-gray-700 w-[150px]">
                      Location:
                    </div>{" "}
                    {data?.data?.class_details?.training_site?.address_line_1},{" "}
                    {data?.data?.class_details?.training_site?.address_line_2},{" "}
                    {data?.data?.class_details?.training_site?.city},{" "}
                    {data?.data?.class_details?.training_site?.state_province},{" "}
                    {data?.data?.class_details?.training_site?.postal_code},{" "}
                    {data?.data?.class_details?.training_site?.country}
                  </p>
                  <p className="flex items-center text-sm">
                    <div className="leading-[1.45] font-medium text-sm sm:text-base text-gray-700 w-[150px]">
                      Class Price:
                    </div>{" "}
                    ${data?.data?.class_details?.price}
                  </p>
                </div>

                <FormInput
                  name={`promo_code`}
                  label="Promo Code:"
                  placeholder="Promo Code"
                />
              </div>
              <h6 className="text-xl font-medium mb-1 mt-3">
                Student Information
              </h6>
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
                <FormInput
                  name={`first_name`}
                  label="First Name"
                  placeholder="First Name"
                />
                <FormInput
                  name={`last_name`}
                  label="Last Name"
                  placeholder="Last Name"
                />
                <FormInput
                  name={`email_address`}
                  label="Email Address"
                  placeholder="Email Address"
                />
                <FormInput
                  name={`confirm_email_address`}
                  label="Confirm Email Address"
                  placeholder="Confirm Email Address"
                />
                <FormInput
                  name={`mobile_phone`}
                  label="Mobile Phone"
                  placeholder="Mobile Phone"
                />
                <FormInput
                  name={`alternate_phone`}
                  label="Alternate Phone"
                  placeholder="Alternate Phone"
                />
              </div>
              <h6 className="text-xl font-medium mb-1 mt-3">Mailing Address</h6>
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
                <FormInput
                  name={`address_1`}
                  label="Address 1"
                  placeholder="Address 1"
                />
                <FormInput
                  name={`address_2`}
                  label="Address 2"
                  placeholder="Address 2"
                />
                <FormInput name={`city`} label="City" placeholder="City" />
                <FormInput
                  name={`state`}
                  label="State/Province/Region"
                  placeholder="State/Province/Region"
                />
                <FormInput
                  name={`zip_code`}
                  label="Zip/Postal Code"
                  placeholder="Zip/Postal Code"
                />
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="country"
                      label="Country"
                      placeholder="Country"
                      isLoading={countryDataLoading}
                      options={countryData?.data}
                      error={errors.country?.message}
                      className="flex-1"
                    />
                  )}
                />
                {/* <label className="flex items-center gap-1">
                  <input {...register("new_billing_address")} type="checkbox" />
                  Use the above address as my billing address
                </label> */}
              </div>
              {/* <h6 className="text-xl font-medium mb-1 mt-3">Billing Address</h6>
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
                <FormInput
                  name={`billing_address_1`}
                  label="Address 1"
                  placeholder="Address 1"
                />
                <FormInput
                  name={`billing_address_2`}
                  label="Address 2"
                  placeholder="Address 2"
                />
                <FormInput
                  name={`billing_city`}
                  label="City"
                  placeholder="City"
                />
                <FormInput
                  name={`billing_state`}
                  label="State/Province/Region"
                  placeholder="State/Province/Region"
                />
                <FormInput
                  name={`billing_zip_code`}
                  label="Zip/Postal Code"
                  placeholder="Zip/Postal Code"
                />
                <Controller
                  name="billing_country"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="country"
                      label="Country"
                      placeholder="Country"
                      isLoading={countryDataLoading}
                      options={countryData?.data}
                      error={errors.country?.message}
                      className="flex-1"
                    />
                  )}
                />
              </div> */}
              <h6 className="text-xl font-medium mb-1 mt-3">
                Additional Information
              </h6>
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 bg-neutral-50 border px-1 sm:px-2 pt-2 pb-4 rounded-md">
                <div className="flex flex-col gap-1 lg:gap-2  lg:mt-2">
                  <p className="font-semibold text-[15px] text-gray-700">
                    Would you like to receive text message class reminders?
                  </p>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        value="yes"
                        {...register("receive_text_messages")}
                        className="accent-brown"
                      />
                      Yes
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        value="no"
                        {...register("receive_text_messages")}
                        className="accent-brown"
                      />
                      No
                    </label>
                  </div>
                </div>
                <FormInput
                  name={`how_did_you_hear`}
                  label="How Did You Hear About Us?"
                />
                <div className={"col-span-2"}>
                  <FormInput
                    name={`instructor_interest_notes`}
                    label="Would you be interested in finding out more about how to become a CPR Instructor? If so, Please comment in the box more information and we will send you information about how to become a CPR Instructor,"
                  />
                </div>
                <div className={"col-span-2"}>
                  <FormTextarea
                    name={`comments`}
                    label="Please include any comments or special requests here:"
                  />
                </div>
                {/* <p className="col-span-2 text-sm">
                  By agreeing to receive SMS Account Notification messages, you
                  agree to receive messages regarding class updates, schedules,
                  and reminders at the number provided in the sign-up form.
                  Consent is not a condition of purchase. You may reply STOP to
                  unsubscribe. Message frequency varies. Msg & Data rates may
                  apply. View our{" "}
                  <Link href={``} className="text-brown">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href={``} className="text-brown">
                    Terms and Conditions
                  </Link>
                  .
                </p>
                <label className="flex items-center gap-1 col-span-2">
                  <input type="checkbox" />I have read and agree to the above
                  terms and conditions
                </label> */}
              </div>
              <div className="flex justify-center my-4">
                <button
                  type="submit"
                  className="border bg-neutral-100 cursor-pointer hover:bg-neutral-200 rounded-md px-3 py-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? "Processing ..." : "Continue with Registration"}
                </button>
              </div>
            </FormContainer>
          </div>
        )}
      </div>
      <div className="basis-1/3">
        <h2 className="border-b text-xl font-medium mb-1">Secure Site</h2>
        <div className="flex gap-3 my-4">
          <div className="shrink-0">
            <img
              src={"https://codeblueservices.enrollware.com/reg/img/lock.png"}
              alt=""
              className="!shrink-0 size-16"
            />
          </div>
          <p className="text-[13px]">
            Please be assured that your information is protected and secure. We
            value your privacy and do not provide customer information to any
            third parties.
          </p>
        </div>
        <h2 className="border-b text-xl font-medium mb-1">Contact Us</h2>
      </div>
    </div>
  );
};

export default Page;
