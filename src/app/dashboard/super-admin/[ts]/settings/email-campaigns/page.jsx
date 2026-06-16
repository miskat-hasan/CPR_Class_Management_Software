"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";
import SectionTitle from "@/components/common/SectionTitle";
import ConfirmModal from "@/components/common/ConfirmModal";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/svg/SvgContainer";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
} from "@/components/common/TableElement";
import {
  getAllEmailCampaigns,
  deleteEmailCampaign,
  deleteEmailTemplate,
} from "@/hooks/api/dashboardApi";
import { CiEdit } from "react-icons/ci";
import { HiOutlineTrash } from "react-icons/hi";

export default function EmailCampaignsPage() {
  const { ts } = useParams();

  const [deleteCampaignTarget, setDeleteCampaignTarget] = useState(null);
  const [deleteEmailTarget, setDeleteEmailTarget] = useState(null);

  const { data, isLoading, refetch } = getAllEmailCampaigns();

  const { mutate: deleteCampaignMutate, isPending: isDeletingCampaign } =
    deleteEmailCampaign();
  const { mutate: deleteEmailMutate, isPending: isDeletingEmail } =
    deleteEmailTemplate();

  const handleConfirmDeleteCampaign = () => {
    deleteCampaignMutate(
      { endpoint: `/api/email-campaigns/${deleteCampaignTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Campaign deleted");
          setDeleteCampaignTarget(null);
          refetch();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
          setDeleteCampaignTarget(null);
        },
      },
    );
  };

  const handleConfirmDeleteEmail = () => {
    deleteEmailMutate(
      { endpoint: `/api/email-campaigns/emails/${deleteEmailTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Email deleted");
          setDeleteEmailTarget(null);
          refetch();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Something went wrong!");
          setDeleteEmailTarget(null);
        },
      },
    );
  };

  const campaigns = data?.data ?? [];

  return (
    <>
      <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
        <div className="flex justify-between">
          <SectionTitle title="Email Campaigns" />
          <Button
            asChild
            className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2 dark:hover:bg-brown"
          >
            <Link
              href={`/dashboard/super-admin/${ts}/settings/email-campaigns/add`}
            >
              New Campaign <PlusIcon />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : campaigns.length > 0 ? (
          <div className="flex flex-col gap-4">
            {campaigns.map(campaign => (
              <div
                key={campaign.id}
                className="bg-white dark:bg-black rounded-[14px] overflow-hidden shadow-sm border dark:border-neutral-700"
              >
                {/* Campaign header */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 flex-wrap gap-2">
                  <h6 className="font-semibold text-sm text-black dark:text-gray">
                    {campaign.name}
                  </h6>
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="text-xs px-3 py-1.5 bg-brown dark:bg-dark-brown hover:bg-brown-hover text-white cursor-pointer"
                    >
                      <Link
                        href={`/dashboard/super-admin/${ts}/settings/email-campaigns/${campaign.id}/edit`}
                      >
                        Edit Campaign
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="text-xs px-3 py-1.5 bg-brown dark:bg-dark-brown hover:bg-brown-hover text-white cursor-pointer"
                    >
                      <Link
                        href={`/dashboard/super-admin/${ts}/settings/email-campaigns/${campaign.id}/emails/add`}
                      >
                        Add New Email
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs px-3 py-1.5 bg-brown dark:bg-dark-brown hover:bg-brown-hover text-white cursor-pointer"
                      onClick={() => setDeleteCampaignTarget(campaign)}
                    >
                      Delete Campaign
                    </Button>
                    {/* Delete campaign */}
                    {/* <TableButton
                      isLink={false}
                      type="button"
                      onClick={() => setDeleteCampaignTarget(campaign)}
                    >
                      <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px]" />
                    </TableButton> */}
                  </div>
                </div>

                {/* Emails table */}
                <div className="p-4">
                  {campaign.emails?.length > 0 ? (
                    <Table>
                      <TableHead>
                        <tr>
                          <th className="px-4 py-2 text-left whitespace-nowrap">
                            Day to Send
                          </th>
                          <th className="px-4 py-2 text-left whitespace-nowrap">
                            Subject Line
                          </th>
                          <th className="px-4 py-2 text-right whitespace-nowrap">
                            Action
                          </th>
                        </tr>
                      </TableHead>
                      <tbody>
                        {campaign.emails.map(email => (
                          <TableBodyRow key={email.id}>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 w-28 whitespace-nowrap">
                              {email.days_type === "before"
                                ? `-${email.days}`
                                : `+${email.days}`}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {email.subject}
                            </td>
                            <td className="px-4 py-3 text-left">
                              <div className="flex items-center justify-end gap-2">
                                <TableButton
                                  href={`/dashboard/super-admin/${ts}/settings/email-campaigns/${campaign.id}/emails/${email.id}/edit`}
                                >
                                  <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                                </TableButton>
                                <TableButton
                                  isLink={false}
                                  type="button"
                                  onClick={() => setDeleteEmailTarget(email)}
                                >
                                  <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px]" />
                                </TableButton>
                              </div>
                            </td>
                          </TableBodyRow>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-sm text-gray-400 italic text-center py-4">
                      No emails in this campaign yet.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-black rounded-[14px] p-8 text-center text-gray-400 italic text-sm">
            No campaigns found.
          </div>
        )}
      </section>

      {/* Delete campaign modal */}
      <ConfirmModal
        open={!!deleteCampaignTarget}
        title="Delete this campaign?"
        description={`"${deleteCampaignTarget?.name}" and all its emails will be permanently deleted.`}
        confirmLabel="Delete Campaign"
        onConfirm={handleConfirmDeleteCampaign}
        onCancel={() => setDeleteCampaignTarget(null)}
        isPending={isDeletingCampaign}
      />

      {/* Delete email modal */}
      <ConfirmModal
        open={!!deleteEmailTarget}
        title="Delete this email?"
        description={`"${deleteEmailTarget?.subject}" will be permanently deleted.`}
        confirmLabel="Delete Email"
        onConfirm={handleConfirmDeleteEmail}
        onCancel={() => setDeleteEmailTarget(null)}
        isPending={isDeletingEmail}
      />
    </>
  );
}
