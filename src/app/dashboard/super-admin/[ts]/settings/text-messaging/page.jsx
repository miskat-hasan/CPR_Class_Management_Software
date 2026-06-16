"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import SectionTitle from "@/components/common/SectionTitle";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import ConfirmModal from "@/components/common/ConfirmModal";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
} from "@/components/common/TableElement";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import {
  getTextCampaignSettings,
  updateTextCampaignSettings,
  getAllTextMessages,
  deleteTextMessage,
} from "@/hooks/api/dashboardApi";
import { CiEdit } from "react-icons/ci";
import { HiOutlineTrash } from "react-icons/hi";
import { Check } from "lucide-react";

export default function TextMessagingPage() {
  const { ts } = useParams();
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Basic settings form
  const settingsForm = useForm({
    defaultValues: {
      phone: "",
      autoReply: "",
      forwardMail: "",
    },
  });

  const {
    data: settingsData,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = getTextCampaignSettings();
  const { mutate: updateSettings, isPending: isUpdatingSettings } =
    updateTextCampaignSettings();

  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = getAllTextMessages();
  const { mutate: deleteMutate, isPending: isDeleting } = deleteTextMessage();

  // Populate settings form
  useEffect(() => {
    if (settingsData?.data) {
      const d = settingsData.data;
      settingsForm.reset({
        phone: d.phone_number ?? "",
        autoReply: d.auto_reply ?? "",
        forwardMail: d.forward_mail ?? "",
      });
    }
  }, [settingsData, settingsForm]);

  const onSettingsSubmit = data => {
    updateSettings(
      {
        data: {
          phone: data.phone,
          auto_reply: data.autoReply,
          forward_mail: data.forwardMail,
        },
      },
      {
        onSuccess: res => {
          toast.success(res?.message || "Settings updated successfully");
          refetchSettings();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    deleteMutate(
      { endpoint: `/api/text-campaigns/messages/${deleteTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Message deleted");
          setDeleteTarget(null);
          refetchMessages();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
          setDeleteTarget(null);
        },
      },
    );
  };

  const messages = messagesData?.data ?? [];

  return (
    <>
      <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
        <SectionTitle title="Text Messaging Settings" />

        {/* Basic Settings */}
        <div className="bg-white dark:bg-black rounded-[14px] p-6 lg:p-8 shadow-sm flex flex-col gap-5">
          <h6 className="font-semibold text-base text-black dark:text-gray">
            Basic Settings
          </h6>

          {settingsLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <FormContainer form={settingsForm} onSubmit={onSettingsSubmit}>
              <div className="flex flex-col gap-5">
                {/* Phone number — read only display */}
                {settingsData?.data?.phone_number && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray">
                      Phone Number
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {settingsData.data.phone_number}
                    </p>
                  </div>
                )}

                <FormInput
                  name="phone"
                  label="Phone"
                  placeholder="+1234567890"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray">
                    Auto Reply
                  </label>
                  <textarea
                    {...settingsForm.register("autoReply")}
                    rows={3}
                    placeholder="Auto reply message..."
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
                  />
                </div>

                <FormInput
                  name="forwardMail"
                  label="Forward Email"
                  placeholder="admin@example.com"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdatingSettings}
                    className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brown dark:bg-dark-brown hover:bg-brown-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingSettings ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </div>
            </FormContainer>
          )}
        </div>

        {/* Scheduled Text Messages */}
        <div className="bg-white dark:bg-black rounded-[14px] shadow-sm overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h6 className="font-semibold text-base text-black dark:text-gray">
              Scheduled Text Messages
            </h6>
            <Button
              asChild
              className="py-2 px-4 cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown text-sm"
            >
              <Link
                href={`/dashboard/super-admin/${ts}/settings/text-messaging/add`}
              >
                Add New Message <PlusIcon />
              </Link>
            </Button>
          </div>

          <div className="p-4 lg:p-6">
            {messagesLoading ? (
              <TableSkeleton />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <tr>
                      <th className="px-4 py-3 text-left whitespace-nowrap">
                        Day to Send
                      </th>
                      <th className="px-4 py-3 text-left whitespace-nowrap">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left whitespace-nowrap">
                        Message
                      </th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">
                        Active
                      </th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </TableHead>
                  <tbody>
                    {messages.length > 0 ? (
                      messages.map(msg => (
                        <TableBodyRow key={msg.id}>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap w-24">
                            {msg.days_type === "before"
                              ? `-${msg.days}`
                              : `+${msg.days}`}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                            {msg.message_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                            <p className="truncate">{msg.message}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {msg.active ? (
                              <Check
                                size={16}
                                className="text-green-500 mx-auto"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">No</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <TableButton
                                href={`/dashboard/super-admin/${ts}/settings/text-messaging/${msg.id}/edit`}
                              >
                                <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                              </TableButton>
                              <TableButton
                                isLink={false}
                                type="button"
                                onClick={() => setDeleteTarget(msg)}
                              >
                                <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px]" />
                              </TableButton>
                            </div>
                          </td>
                        </TableBodyRow>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-gray-400 italic text-sm"
                        >
                          No scheduled messages yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this message?"
        description={`"${deleteTarget?.message_name}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isDeleting}
      />
    </>
  );
}
