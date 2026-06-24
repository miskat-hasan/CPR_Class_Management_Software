// src/components/enroll/StepStudentInfo.jsx
"use client";

import { Controller } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import CustomSelect from "@/components/shared/form/CustomSelect";
import RegistrationQuestionField from "./RegistrationQuestionField";
import SubSectionTitle from "../common/SubSectionTitle";

const SectionTitle = ({ children }) => (
  <h6 className="text-base font-semibold text-gray-800 dark:text-white mb-3 mt-5 first:mt-0">
    {children}
  </h6>
);

const SectionBox = ({ children, cols = 2 }) => (
  <div
    className={`grid gap-4 grid-cols-1 ${
      cols === 2 ? "md:grid-cols-2" : ""
    } bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 px-3 py-4 rounded-lg`}
  >
    {children}
  </div>
);

const inputCls =
  "w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none";

const StepStudentInfo = ({
  form,
  classDetails,
  siteSettings,
  registrationQuestions,
  countryData,
  countryDataLoading,
  onBack,
  onNext,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const regSettings = siteSettings?.registration_settings;

  // Split questions: those before comments box vs after (priority-sorted)
  const sortedQuestions = [...registrationQuestions].sort(
    (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
  );

  const onValid = () => onNext();

  return (
    <FormContainer form={form} onSubmit={onValid}>
      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
        Please complete the following form to reserve your space in this class.
        You will have an opportunity to review and edit your information on the
        next page.
      </p>

      {/* Class Info summary */}
      <SectionTitle>Class Information</SectionTitle>
      <SectionBox cols={1}>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="font-medium text-gray-700 dark:text-zinc-300 w-32 shrink-0">
              Course:
            </span>
            <span className="text-gray-800 dark:text-white">
              {classDetails?.course?.course_name}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-gray-700 dark:text-zinc-300 w-32 shrink-0">
              Date/Time:
            </span>
            <div className="flex flex-col gap-0.5 text-gray-800 dark:text-white">
              {classDetails?.class_times?.map((t, i) => (
                <span key={i}>
                  {t.date} from {t.from} to {t.to}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-gray-700 dark:text-zinc-300 w-32 shrink-0">
              Location:
            </span>
            <span className="text-gray-800 dark:text-white">
              {[
                classDetails?.location?.address_1,
                classDetails?.location?.city,
                classDetails?.location?.state,
                classDetails?.location?.zip,
              ]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-gray-700 dark:text-zinc-300 w-32 shrink-0">
              Class Price:
            </span>
            <span className="font-semibold text-gray-800 dark:text-white">
              ${parseFloat(classDetails?.price ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="max-w-xs">
          <FormInput
            name="promo_code"
            label="Promo Code"
            placeholder="Enter promo code"
          />
        </div>
      </SectionBox>

      {/* Student Info */}
      <SectionTitle>Student Information</SectionTitle>
      <SectionBox>
        <FormInput
          name="first_name"
          label="First Name"
          placeholder="First Name"
          rules={{ required: "First name is required" }}
        />
        <FormInput
          name="last_name"
          label="Last Name"
          placeholder="Last Name"
          rules={{ required: "Last name is required" }}
        />
        <FormInput
          name="email_address"
          label="Email Address"
          placeholder="Email Address"
          rules={{
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
          }}
        />
        <FormInput
          name="confirm_email_address"
          label="Confirm Email Address"
          placeholder="Confirm Email Address"
          rules={{
            required: "Please confirm your email",
            validate: val =>
              val === form.getValues("email_address") || "Emails do not match",
          }}
        />
        <FormInput
          name="mobile_phone"
          label={
            regSettings?.options?.prompt_mobile_phone
              ? "Mobile Phone"
              : "Primary Phone"
          }
          placeholder="Phone number"
          rules={{ required: "Phone number is required" }}
        />
        <FormInput
          name="alternate_phone"
          label="Alternate Phone"
          placeholder="Alternate phone (optional)"
        />
      </SectionBox>

      {/* Mailing Address */}
      <SectionTitle>Mailing Address</SectionTitle>
      <SectionBox>
        <FormInput
          name="address_1"
          label="Address 1"
          placeholder="Street address"
        />
        <FormInput
          name="address_2"
          label="Address 2"
          placeholder="Apt, suite, etc."
        />
        <FormInput name="city" label="City" placeholder="City" />
        <FormInput
          name="state"
          label="State / Province / Region"
          placeholder="State"
        />
        <FormInput
          name="zip_code"
          label="Zip / Postal Code"
          placeholder="Zip code"
        />
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field, fieldState }) => (
            <CustomSelect
              {...field}
              label="Country"
              placeholder="Select country"
              isLoading={countryDataLoading}
              options={countryData?.data ?? []}
              error={fieldState.error?.message}
            />
          )}
        />
      </SectionBox>

      {/* Additional Information */}
      <SectionTitle>Additional Information</SectionTitle>
      <div className="flex flex-col gap-4 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 px-3 py-4 rounded-lg">
        {/* Text message opt-in */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
            Would you like to receive text message class reminders?
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                value="yes"
                {...register("receive_text_messages")}
                className="accent-gray-900 dark:accent-white"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                value="no"
                {...register("receive_text_messages")}
                className="accent-gray-900 dark:accent-white"
              />
              No
            </label>
          </div>
        </div>

        {/* Registration Questions — rendered above the comments box */}
        {sortedQuestions.length > 0 && (
          <div className="flex flex-col gap-4 border-t dark:border-zinc-700 pt-4">
            {sortedQuestions.map(q => (
              <RegistrationQuestionField key={q.id} question={q} form={form} />
            ))}
          </div>
        )}

        {/* Comments */}
        <div>
          <FormTextarea
            name="comments"
            label="Please include any comments or special requests here:"
          />
        </div>

        {/* Texting Privacy Policy */}
        {regSettings?.texting_privacy_policy && (
          <div>
            <SubSectionTitle subtitle={"Texting Privacy Policy"} />
            <div className="max-h-[300px] overflow-y-auto border rounded-lg p-2 mt-3">
              <div
                className="prose prose-xs dark:prose-invert max-w-none text-xs leading-relaxed text-gray-500 dark:text-zinc-500 border-t dark:border-zinc-700 pt-3"
                dangerouslySetInnerHTML={{
                  __html: regSettings.texting_privacy_policy
                    ?.replace(
                      /background-color:\s*rgb\(255,\s*255,\s*255\);?/g,
                      "",
                    )
                    ?.replace(/color:\s*rgb\(28,\s*27,\s*31\);?/g, ""),
                }}
              />
            </div>
          </div>
        )}
        {/* Terms & Conditions */}
        {regSettings?.terms_and_conditions_html && (
          <div>
            <SubSectionTitle subtitle={"Terms & Conditions"} />
            <div className="max-h-[300px] overflow-y-auto border rounded-lg p-2 mt-3">
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed mt-5
          [&_ol]:list-decimal [&_ol]:pl-5
          [&_li[data-list=bullet]]:list-disc [&_li[data-list=bullet]]:ml-6"
                dangerouslySetInnerHTML={{
                  __html: regSettings.terms_and_conditions_html
                    ?.replace(
                      /background-color:\s*rgb\(255,\s*255,\s*255\);?/g,
                      "",
                    )
                    ?.replace(/color:\s*rgb\(28,\s*27,\s*31\);?/g, ""),
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-5">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 font-medium text-sm rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm rounded-md hover:bg-gray-700 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Review & Pay →
        </button>
      </div>
    </FormContainer>
  );
};

export default StepStudentInfo;
