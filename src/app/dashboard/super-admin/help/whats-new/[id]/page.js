import UpdateWhatIsNew from "@/components/dashboard/help/UpdateWhatsNew";

const Page = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <UpdateWhatIsNew id={id} />
    </div>
  );
};

export default Page;
