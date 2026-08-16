import EditKeyCodesPage from "@/components/dashboard/courses/keycodes/EditKeyCodesPage";
import React from "react";

const Page = ({ params }) => {
  const { id } = params;
  return (
    <div>
      <EditKeyCodesPage id={id} />
    </div>
  );
};

export default Page;
