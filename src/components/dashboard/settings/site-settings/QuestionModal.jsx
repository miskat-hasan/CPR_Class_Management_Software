// src/components/dashboard/settings/site-settings/QuestionModal.jsx
"use client";

import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";
import MultiSelect from "@/components/shared/form/MultiSelect";
import { Button } from "@/components/ui/button";
import {
  useGetSingleRegistrationQuestion,
  useCreateRegistrationQuestion,
  useUpdateRegistrationQuestion,
  getAllCourses,
} from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

const NEEDS_CHOICES = ["radio_button", "drop_down"];

const QuestionModal = ({ editId, onClose, onSaved, QUESTION_TYPES }) => {
  const isEdit = !!editId;

  // Fetch existing data when editing
  const { data: singleData, isLoading: singleLoading } =
    useGetSingleRegistrationQuestion(editId);

  const { mutate: createQuestion, isPending: createPending } =
    useCreateRegistrationQuestion();
  const { mutate: updateQuestion, isPending: updatePending } =
    useUpdateRegistrationQuestion(editId);

  const isPending = createPending || updatePending;

  // Courses for multi-select (type=all)
  const { data: coursesData, isLoading: coursesLoading } = getAllCourses({
    type: "all",
  });
  const courseOptions = (coursesData?.data ?? []).map(c => ({
    id: c.id,
    name: c.course_name,
  }));

  const form = useForm({
    defaultValues: {
      question: "",
      type: "",
      priority: "",
      is_required: false,
      show_for_specific_courses: false,
      choices: [{ value: "" }],
      course_ids: [],
    },
  });

  const { register, control, watch, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "choices",
  });

  const questionType = watch("type");
  const showForSpecific = watch("show_for_specific_courses");
  const needsChoices = NEEDS_CHOICES.includes(questionType);

  useEffect(() => {
    if (singleData?.data) {
      const d = singleData.data;
      reset({
        question: d.question ?? "",
        type: d.type ?? "",
        priority: d.priority ?? "",
        is_required: d.is_required ?? false,
        show_for_specific_courses: d.show_for_specific_courses ?? false,
        choices:
          d.choices?.length > 0
            ? d.choices.map(v => ({ value: v }))
            : [{ value: "" }],
        course_ids: (d.courses ?? []).map(c => String(c.id)),
      });
    }
  }, [singleData, reset]);

  const onSubmit = data => {
    const payload = {
      question: data.question,
      type: data.type,
      priority: Number(data.priority) || 1,
      is_required: data.is_required,
      show_for_specific_courses: data.show_for_specific_courses,
    };

    if (needsChoices) {
      payload.choices = data.choices.map(c => c.value.trim()).filter(Boolean);
    }

    if (data.show_for_specific_courses && data.course_ids?.length) {
      payload.course_ids = data.course_ids.map(Number);
    }

    const mutate = isEdit ? updateQuestion : createQuestion;
    mutate(payload, {
      onSuccess: res => {
        toast.success(
          res?.message ??
            `Question ${isEdit ? "updated" : "created"} successfully.`,
        );
        onSaved();
        onClose();
      },
      onError: err =>
        toast.error(err?.response?.data?.message ?? "Something went wrong."),
    });
  };

  if (singleLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/50 px-4 overflow-y-auto py-8">
        <div className="bg-white dark:bg-black rounded-[14px] p-6 w-full max-w-lg flex flex-col gap-5 shadow-xl my-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              {isEdit ? "Edit Question" : "New Question"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <X className="size-4 text-gray-500" />
            </button>
          </div>
          <div className="animate-pulse space-y-3 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/50 px-4 overflow-y-auto py-8">
      <div className="bg-white dark:bg-black rounded-[14px] p-6 w-full max-w-lg flex flex-col gap-5 shadow-xl my-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            {isEdit ? "Edit Question" : "New Question"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="size-4 text-gray-500" />
          </button>
        </div>

        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            {/* Question */}
            <FormInput
              name="question"
              label="Question"
              placeholder="Enter your question"
              rules={{ required: "Question is required" }}
            />

            {/* Type + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field, fieldState }) => (
                  <CustomSelect
                    {...field}
                    label="Type"
                    placeholder="Select type"
                    options={QUESTION_TYPES}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <FormInput
                name="priority"
                label="Priority"
                placeholder="e.g. 1"
              />
            </div>

            {/* Choices — only for radio_button / drop_down */}
            {needsChoices && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray">
                  Choices
                </label>
                <div className="flex flex-col gap-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        {...register(`choices.${index}.value`, {
                          required: "Choice cannot be empty",
                        })}
                        placeholder={`Choice ${index + 1}`}
                        className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-red-100 transition cursor-pointer"
                        >
                          <X className="size-3.5 text-gray-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => append({ value: "" })}
                  className="flex items-center gap-1.5 text-sm text-brown dark:text-dark-brown hover:underline w-fit cursor-pointer mt-1"
                >
                  <Plus className="size-3.5" />
                  Add choice
                </button>
              </div>
            )}

            {/* Booleans */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray w-fit">
                <input
                  type="checkbox"
                  {...register("is_required")}
                  className="accent-brown"
                />
                Required
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray w-fit">
                <input
                  type="checkbox"
                  {...register("show_for_specific_courses")}
                  className="accent-brown"
                />
                Show for specific courses only
              </label>
            </div>

            {/* Course multi-select — only when show_for_specific_courses is true */}
            {showForSpecific && (
              <Controller
                name="course_ids"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    label="Courses"
                    placeholder="Search and select courses..."
                    isLoading={coursesLoading}
                    options={courseOptions}
                  />
                )}
              />
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="h-9 text-sm cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-9 text-sm font-medium text-white bg-brown dark:bg-dark-brown hover:bg-dark-brown dark:hover:bg-brown focus:outline-none disabled:opacity-60"
              >
                {isPending ? "Saving..." : isEdit ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default QuestionModal;
