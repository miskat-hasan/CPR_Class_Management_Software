// src/components/dashboard/clients/EditClientPage.jsx
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import ClientForm from "@/components/dashboard/clients/ClientForm";
import { getSingleClient, updateSingleClient } from "@/hooks/api/dashboardApi";
import { toast } from "sonner";

const EditClientPage = ({ id }) => {
  
  const { data: clientData, isLoading: clientDataLoading } =
    getSingleClient(id);
  
  const { mutateAsync: updateClientMutation, isPending } =
    updateSingleClient(id);

  const defaultValues = clientData?.data && {
    company: clientData.data.company ?? "",
    abbreviation: clientData.data.abbreviation ?? "",
    contactFirstName: clientData.data.contact_first_name ?? "",
    contactLastName: clientData.data.contact_last_name ?? "",
    emailAddress: clientData.data.email ?? "",
    contactDate: clientData.data.contact_date ?? "",
    website: clientData.data.website ?? "",
    mainPhone: clientData.data.main_phone ?? "",
    mobilePhone: clientData.data.mobile_phone ?? "",
    fax: clientData.data.fax ?? "",
    country: clientData.data.country_id ?? "",
    address1: clientData.data.address_1 ?? "",
    address2: clientData.data.address_2 ?? "",
    city: clientData.data.city ?? "",
    stateProvince: clientData.data.state ?? "",
    zipPostalCode: clientData.data.zip ?? "",
    username: clientData.data.username ?? "",
    // password: clientData.data.password ?? "",
    ccConfirmationsTo: clientData.data.cc_confirmations_to ?? "",
  };

  const onSubmit = async formData => {
    await updateClientMutation(formData, {
      onSuccess: data => {
        toast.success(data?.message || "Client updated successfully");
      },
      onError: err => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  if (clientDataLoading) {
    return (
      <section className="flex flex-col gap-2 lg:gap-4">
        <SectionTitle title={"Update Client"} />
        <div className="p-[26px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-brown dark:border-t-dark-brown rounded-full animate-spin" />
            <span className="text-sm">Loading client data…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2 lg:gap-4">
      <SectionTitle title={"Update Client"} />
      <ClientForm
        defaultValues={defaultValues}
        sharedNotesInitial={clientData?.data?.shared_notes}
        internalNotesInitial={clientData?.data?.internal_notes}
        onSubmit={onSubmit}
        isPending={isPending}
        isEdit
      />
    </section>
  );
};

export default EditClientPage;
