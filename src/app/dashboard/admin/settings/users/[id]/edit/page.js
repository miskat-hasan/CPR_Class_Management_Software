"use client";

import UserForm from "@/components/dashboard/settings/users/UserForm";
import { useParams } from "next/navigation";

const EditUserPage = () => {
  const { id } = useParams();
  return <UserForm mode="edit" id={id} />;
};

export default EditUserPage;
