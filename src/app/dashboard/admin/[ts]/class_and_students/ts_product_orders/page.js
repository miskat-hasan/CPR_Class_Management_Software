import TsProductOrders from "@/components/dashboard/class-and-students/ts-product-orders/TsProductOrders";

const Page = ({ params }) => {
  const { ts } = params;
  return (
    <div>
      <TsProductOrders ts={ts} />
    </div>
  );
};

export default Page;
