import AddNewEmail from "@/components/dashboard/AddNewEmail";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;

  return (
    <div>
      <AddNewEmail id={id} />
    </div>
  );
};

export default page;
