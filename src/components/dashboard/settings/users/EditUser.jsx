"use client";

import { useParams } from "next/navigation";
import UserForm from "./UserForm";

const EditUser = () => {
  const { id } = useParams();
  return <UserForm mode="edit" id={id} />;
};

export default EditUser;
