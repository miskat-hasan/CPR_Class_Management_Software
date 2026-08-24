import ClassDetails from "@/components/dashboard/clients/ClassDetails";

const Page = ({ params }) => {
  const { id } = params;

  return (
    <>
      <ClassDetails id={id} />
    </>
  );
};

export default Page;

// src/app/dashboard/client/class-and-students/past-classes/[classId]/page.js
// "use client";

// import { useParams } from "next/navigation";
// import ClientClassDetailsPage from "@/components/dashboard/class-and-students/ClientClassDetailsPage";

// export default function Page() {
//   const { classId } = useParams();
//   return <ClientClassDetailsPage classId={classId} />;
// }