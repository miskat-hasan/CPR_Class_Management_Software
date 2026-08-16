import EditPromoCodesPage from "@/components/dashboard/settings/promo-codes/EditPromoCodesPage";
import React from "react";

const Page = ({ params }) => {
  const { id } = params;
  return (
    <div>
      <EditPromoCodesPage id={id} />
    </div>
  );
};

export default Page;
