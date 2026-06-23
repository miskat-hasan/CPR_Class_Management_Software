// src/components/dashboard/site-settings/CustomRegistrationQuestions.jsx
"use client";

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import CustomSelect from "@/components/shared/form/CustomSelect";
import MultiSelect from "@/components/shared/form/MultiSelect";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import {
  useGetRegistrationQuestions,
  useGetSingleRegistrationQuestion,
  useCreateRegistrationQuestion,
  useUpdateRegistrationQuestion,
  useDeleteRegistrationQuestion,
  getAllCourses,
} from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import { CiEdit } from "react-icons/ci";
import { LucideTrash2, Plus, X } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  { id: "text_box", name: "Text Box" },
  { id: "text_area", name: "Text Area" },
  { id: "radio_button", name: "Radio Button" },
  { id: "drop_down", name: "Drop Down" },
  { id: "file_upload", name: "File Upload" },
];

const NEEDS_CHOICES = ["radio_button", "drop_down"];

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

const QuestionModal = ({ editId, onClose, onSaved }) => {
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

  // Pre-fill form once single data is loaded
  useState(() => {
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
  }, [singleData]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
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

        {isEdit && singleLoading ? (
          <div className="animate-pulse space-y-3 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md"
              />
            ))}
          </div>
        ) : (
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
                  variant="outline"
                  onClick={onClose}
                  className="h-9 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-9 text-sm font-medium text-white bg-brown dark:bg-dark-brown hover:bg-brown focus:outline-none disabled:opacity-60"
                >
                  {isPending ? "Saving..." : isEdit ? "Save" : "Create"}
                </Button>
              </div>
            </div>
          </FormContainer>
        )}
      </div>
    </div>
  );
};

// ─── Type badge ───────────────────────────────────────────────────────────────

const TypeBadge = ({ type }) => {
  const label = QUESTION_TYPES.find(t => t.id === type)?.name ?? type;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
      {label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CustomRegistrationQuestions = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const {
    data: questionsData,
    isLoading,
    refetch,
  } = useGetRegistrationQuestions(page, perPage);

  const { mutate: deleteQuestion, isPending: deletePending } =
    useDeleteRegistrationQuestion(confirmDeleteId);

  const questions = questionsData?.data?.data ?? [];

  const handleDelete = () => {
    deleteQuestion(undefined, {
      onSuccess: res => {
        toast.success(res?.message ?? "Question deleted.");
        setConfirmDeleteId(null);
        refetch();
      },
      onError: err =>
        toast.error(
          err?.response?.data?.message ?? "Failed to delete question.",
        ),
    });
  };

  const openAdd = () => {
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = id => {
    setEditId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
  };

  return (
    <>
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            Custom Registration Questions
          </h3>
          <Button
            type="button"
            onClick={openAdd}
            className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
          >
            New Question
            <PlusIcon />
          </Button>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Question
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">Type</th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Answer Choices
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Priority
                  </th>
                  <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                    Required
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map(item => (
                    <TableBodyRow key={item.id}>
                      <td className="px-3 md:px-6 py-4 max-w-[260px]">
                        {item.question}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <TypeBadge type={item.type} />
                      </td>
                      <td className="px-3 md:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.choices?.length > 0
                          ? item.choices.join(", ")
                          : "—"}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {item.priority}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.is_required
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {item.is_required ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <TableButton isLink={false} onClick={() => openEdit(item.id)}>
                            <CiEdit className="text-gray-600 text-[16px] dark:text-gray" />
                          </TableButton>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-red-100 transition cursor-pointer"
                          >
                            <LucideTrash2 className="text-gray-600 size-[14px] sm:size-[16px]" />
                          </button>
                        </div>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No questions found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        <TableFooter
          Links={questionsData?.data?.links}
          perPage={questionsData?.data?.per_page}
          setPage={setPage}
          setPerPage={setPerPage}
        />
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <QuestionModal editId={editId} onClose={closeModal} onSaved={refetch} />
      )}

      {/* Delete Confirm */}
      {confirmDeleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this question?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
          isPending={deletePending}
        />
      )}
    </>
  );
};

export default CustomRegistrationQuestions;
