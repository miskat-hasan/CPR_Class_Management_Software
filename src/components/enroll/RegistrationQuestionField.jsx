// src/components/enroll/RegistrationQuestionField.jsx
"use client";

import { Controller } from "react-hook-form";

// ── input base classes ────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-500";

// ── individual type renderers ────────────────────────────────────────────────

const TextBox = ({ fieldName, register, isRequired }) => (
  <input
    type="text"
    {...register(fieldName, {
      required: isRequired ? "This field is required" : false,
    })}
    className={inputCls}
    placeholder="Your answer"
  />
);

const TextArea = ({ fieldName, register, isRequired }) => (
  <textarea
    {...register(fieldName, {
      required: isRequired ? "This field is required" : false,
    })}
    rows={3}
    className={`${inputCls} resize-none`}
    placeholder="Your answer"
  />
);

const RadioButton = ({ fieldName, register, choices, isRequired }) => (
  <div className="flex flex-col gap-2">
    {(choices ?? []).map(choice => (
      <label
        key={choice}
        className="flex items-center gap-2 text-sm cursor-pointer"
      >
        <input
          type="radio"
          value={choice}
          {...register(fieldName, {
            required: isRequired ? "Please select an option" : false,
          })}
          className="accent-gray-900 dark:accent-white"
        />
        {choice}
      </label>
    ))}
  </div>
);

const DropDown = ({ fieldName, register, choices, isRequired }) => (
  <select
    {...register(fieldName, {
      required: isRequired ? "Please select an option" : false,
    })}
    className={inputCls}
  >
    <option value="">— Select —</option>
    {(choices ?? []).map(choice => (
      <option key={choice} value={choice}>
        {choice}
      </option>
    ))}
  </select>
);

const FileUpload = ({ fieldName, control, isRequired }) => (
  <Controller
    name={fieldName}
    control={control}
    rules={{ required: isRequired ? "Please upload a file" : false }}
    render={({ field: { onChange, value } }) => (
      <div className="flex flex-col gap-1.5">
        <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-sm text-gray-600 dark:text-zinc-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 w-fit transition-colors">
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          {value instanceof File ? value.name : "Choose file"}
          <input
            type="file"
            className="hidden"
            onChange={e => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
        {value instanceof File && (
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            {value.name}
          </p>
        )}
      </div>
    )}
  />
);

// ── Main export ────────────────────────────────────────────────────────────────
const RegistrationQuestionField = ({ question, form }) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const fieldName = `reg_questions.${question.id}`;
  const isRequired = question.is_required;
  const error = errors?.reg_questions?.[question.id]?.message;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
        {question.question}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {question.type === "text_box" && (
        <TextBox
          fieldName={fieldName}
          register={register}
          isRequired={isRequired}
        />
      )}
      {question.type === "text_area" && (
        <TextArea
          fieldName={fieldName}
          register={register}
          isRequired={isRequired}
        />
      )}
      {question.type === "radio_button" && (
        <RadioButton
          fieldName={fieldName}
          register={register}
          choices={question.choices}
          isRequired={isRequired}
        />
      )}
      {question.type === "drop_down" && (
        <DropDown
          fieldName={fieldName}
          register={register}
          choices={question.choices}
          isRequired={isRequired}
        />
      )}
      {question.type === "file_upload" && (
        <FileUpload
          fieldName={fieldName}
          control={control}
          isRequired={isRequired}
        />
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default RegistrationQuestionField;
