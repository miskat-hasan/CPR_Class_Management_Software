import StudentRoster from "@/components/dashboard/student_roster/StudentRoster";

const Page = ({ params }) => {
  const { id } = params;

  return (
    <>
      <StudentRoster id={id} />
    </>
  );
};

export default Page;
