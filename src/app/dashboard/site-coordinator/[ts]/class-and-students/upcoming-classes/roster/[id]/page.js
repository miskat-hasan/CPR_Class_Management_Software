import StudentRoster from "@/components/dashboard/student-roster/StudentRoster";

const Page = ({ params }) => {
  const { id } = params;

  return (
    <>
      <StudentRoster id={id} />
    </>
  );
};

export default Page;
