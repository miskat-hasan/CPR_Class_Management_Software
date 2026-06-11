"use client";

import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import ConfirmModal from "@/components/common/ConfirmModal";
import KeycodeBankForm from "@/components/dashboard/settings/keycodes/KeycodeBankForm";
import KeycodeLinksTable from "@/components/dashboard/settings/keycodes/KeycodeLinksTable";
import { useForm } from "react-hook-form";
import {
  getSingleKeyCodeBank,
  updateKeyCodeBank,
  deleteKeyCodeBank,
} from "@/hooks/api/dashboardApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Page({ params }) {
  const { id } = params;
  const router = useRouter();

  const [showDeleteBankModal, setShowDeleteBankModal] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      instructions: "",
      course_links: [{ url: "" }],
    },
  });
  const { control, register, reset } = form;

  const { data: keyCodeData, isLoading, refetch } = getSingleKeyCodeBank(id);
  const { mutate: updateMutate, isPending: isUpdating } = updateKeyCodeBank();
  const { mutate: deleteBankMutate, isPending: isDeletingBank } =
    deleteKeyCodeBank();

  const bankData = keyCodeData?.data;

  useEffect(() => {
    if (bankData) {
      reset({
        name: bankData.name ?? "",
        instructions: bankData.instructions ?? "",
        course_links: [{ url: "" }],
      });
    }
  }, [bankData, reset]);

  const onSubmit = data => {
    const newLinks = data.course_links
      .map(l => l.url.trim())
      .filter(Boolean)
      .map(url => ({ url }));

    updateMutate(
      {
        data: {
          id: Number(id),
          name: data.name,
          instructions: data.instructions,
          ...(newLinks.length > 0 && { course_links: newLinks }),
        },
      },
      {
        onSuccess: res => {
          toast.success(res?.message || "Updated successfully");
          reset(prev => ({ ...prev, course_links: [{ url: "" }] }));
          refetch();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Update failed");
        },
      },
    );
  };

  const handleDeleteBank = () => {
    deleteBankMutate(
      { endpoint: `/api/keycode/delete?id=${id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Keycode bank deleted");
          router.back();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Delete failed");
          setShowDeleteBankModal(false);
        },
      },
    );
  };

  return (
    <>
      <section className="flex flex-col gap-4">
        <SectionTitle title="Edit Keycode Bank" />

        <div className="bg-white dark:bg-black rounded-[14px] p-8 shadow-sm">
          <FormContainer form={form} onSubmit={onSubmit}>
            <KeycodeBankForm
              control={control}
              register={register}
              isEdit={true}
              isPending={isUpdating}
              onDelete={() => setShowDeleteBankModal(true)}
              isDeleting={isDeletingBank}
            />
          </FormContainer>
        </div>

        <div className="bg-white dark:bg-black rounded-[14px] p-6 shadow-sm">
          <KeycodeLinksTable
            links={bankData?.links ?? []}
            isLoading={isLoading}
            onRefetch={refetch}
          />
        </div>
      </section>

      <ConfirmModal
        open={showDeleteBankModal}
        title="Delete this keycode bank?"
        description={`"${bankData?.name}" and all its links will be permanently deleted.`}
        confirmLabel="Delete Bank"
        onConfirm={handleDeleteBank}
        onCancel={() => setShowDeleteBankModal(false)}
        isPending={isDeletingBank}
      />
    </>
  );
}
