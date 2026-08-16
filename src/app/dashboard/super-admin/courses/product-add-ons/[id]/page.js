import EditProductAddOnsPage from "@/components/dashboard/courses/product-add-ons/EditProductAddOnsPage";
import React from "react";

const Page = ({ params }) => {
  const { id } = params;
  return (
    <div>
      <EditProductAddOnsPage id={id} />
    </div>
  );
};

export default Page;
