import TsProductOrders from "@/components/dashboard/class_and_students/ts_product_orders/TsProductOrders";

const Page = ({ params }) => {
  const { ts } = params;
  return (
    <div>
      <TsProductOrders ts={ts} />
    </div>
  );
};

export default Page;
