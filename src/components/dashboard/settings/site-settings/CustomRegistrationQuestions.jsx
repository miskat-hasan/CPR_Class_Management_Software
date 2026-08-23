// src/components/dashboard/site-settings/CustomRegistrationQuestions.jsx
"use client";

import { useState } from "react";
import useSiteAwarePagination from "@/hooks/useSiteAwarePagination";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import {
  useGetRegistrationQuestions,
  useDeleteRegistrationQuestion,
} from "@/hooks/api/dashboardApi";
import { toast } from "sonner";
import { CiEdit } from "react-icons/ci";
import { LucideTrash2 } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableFooter,
  TableHead,
} from "@/components/common/TableElement";
import QuestionModal from "./QuestionModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  { id: "text_box", name: "Text Box" },
  { id: "text_area", name: "Text Area" },
  { id: "radio_button", name: "Radio Button" },
  { id: "drop_down", name: "Drop Down" },
  { id: "file_upload", name: "File Upload" },
];

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
  const [page, setPage] = useSiteAwarePagination();
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
                          <TableButton
                            isLink={false}
                            onClick={() => openEdit(item.id)}
                          >
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
        <QuestionModal
          editId={editId}
          onClose={closeModal}
          onSaved={refetch}
          QUESTION_TYPES={QUESTION_TYPES}
        />
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
