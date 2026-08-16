import TsProductOrders from "@/components/dashboard/ts-management/order-products/TsProductOrders";

const Page = ({ params }) => {
  const { ts } = params;
  return (
    <div>
      <TsProductOrders ts={ts} />
    </div>
  );
};

export default Page;
