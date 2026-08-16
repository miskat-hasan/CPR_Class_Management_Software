// src/app/dashboard/super-admin/[ts]/training-center/training-sites/[id]/page.js
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import TrainingSiteForm from "@/components/dashboard/training-sites/TrainingSiteForm";
import {
  getSingleTrainingsite,
  updateTrainingSite,
} from "@/hooks/api/dashboardApi";
import { toast } from "sonner";

const Page = ({ params }) => {
  const { id } = params;

  const { data: trainingSiteData, isLoading } = getSingleTrainingsite(id);
  const { mutateAsync, isPending } = updateTrainingSite(id);

  const d = trainingSiteData?.data;

  const defaultValues = d && {
    company: d.company_name ?? "",
    trainingSite: d.training_center_name ?? "",
    contact_first_name: d.contact_first_name ?? "",
    contact_last_name: d.contact_last_name ?? "",
    address1: d.address_line_1 ?? "",
    address2: d.address_line_2 ?? "",
    city: d.city ?? "",
    fax: d.fax_number ?? "",
    stateProvince: d.state_province ?? "",
    zipPostalCode: d.postal_code ?? "",
    country: d.country ?? "",
    mobilePhone: d.phone_number ?? "",
    emailAddress: d.email ?? "",
    trainingsiteid: d.training_site_id ?? "",
    price_level: d.price_level ? String(d.price_level) : "",
    sales_tax_rate: d.sales_tax_rate ?? "",
    enable_cert_print: Boolean(d.settings?.enable_certification_card_printing),
    send_reminders: Boolean(
      d.settings?.send_reminders_to_instructors_with_unfinalized_rosters,
    ),
    allow_bid: Boolean(d.settings?.create_an_admin_user_for_this_site),
    restrict_product: Boolean(
      d.settings?.restrict_tc_product_orders_to_admins_only,
    ),
    restrict_view: Boolean(
      d.settings?.restrict_instructors_to_only_view_classes_they_teach,
    ),
    user_id: d.user?.id ?? "",
  };

  const coordinatorLabelInitial = d?.user
    ? `${d.user.name} (${d.user.email})`
    : "";

  const onSubmit = async payload => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      formData.append(key, typeof value === "boolean" ? Number(value) : value);
    });

    await mutateAsync(formData, {
      onSuccess: res => {
        toast.success(res?.message || "Training site updated successfully!");
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle title="Update Training Site" />
        <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-brown dark:border-t-dark-brown rounded-full animate-spin" />
            <span className="text-sm">Loading training site…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title="Update Training Site" />
      <TrainingSiteForm
        defaultValues={defaultValues}
        coordinatorLabelInitial={coordinatorLabelInitial}
        onSubmit={onSubmit}
        isPending={isPending}
        isEdit
      />
    </section>
  );
};

export default Page;
