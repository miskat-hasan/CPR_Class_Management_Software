"use client";

import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useGetTCProduct } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import Link from "next/link";
import FormInput from "@/components/shared/form/FormInput";
import FormContainer from "@/components/shared/form/FormContainer";
import { useForm } from "react-hook-form";

const Page = ({ params }) => {
  const { ts } = params;

  const { data: tcProductOrderData, isLoading: tcProductOrderLoading } =
    useGetTCProduct();

  const [formStep, setFormStep] = useState(1);

  const form = useForm({
    defaultValues: {
      quantity: "",
    },
  });

  const { control, register, reset } = form;

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      {tcProductOrderLoading ? (
        <TableSkeleton />
      ) : (
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <FormContainer
            className={"flex flex-col  lg:gap-4"}
            form={form}
            onSubmit={onSubmit}
          >
            {formStep === 1 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-black text-[14px] md:text-[16px] font-semibold">
                      <tr>
                        <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                          Quantity
                        </th>
                        <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                          Product Code
                        </th>
                        <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                          Name
                        </th>
                        <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                          Price
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {tcProductOrderData?.data?.data?.length > 0 ? (
                        tcProductOrderData?.data?.data?.map((item, index) => (
                          <tr
                            key={item?.id}
                            className="border-b hover:bg-gray-50 transition-all"
                          >
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                              <FormInput
                                name={`quantity[${index}]`}
                                placeholder="quantity"
                                className={"min-w-[80px]"}
                              />
                            </td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                              {item?.code}
                            </td>
                            <td className="px-3 md:px-6 py-4">{item?.name}</td>
                            <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                              ${item?.price}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-6 text-gray-500 italic"
                          >
                            No results found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Footer Buttons */}
                <div className="flex justify-end gap-4 mt-5 lg:mt-10">
                  <Button
                    asChild={true}
                    className="px-6 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
                  >
                    <Link href={"../tc_products"}>Back</Link>
                  </Button>
                  <Button
                    // type="submit"
                    // disabled={isPending}
                    onClick={() => setFormStep(2)}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:bg-brown  disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {/* {isPending ? "Updating..." : "Update Product"} */}
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            ) : (
              <>HI</>
            )}
          </FormContainer>
          {formStep === 1 && (
            <div className="flex flex-col md:flex-row items-center justify-center mt-3 lg:mt-6 gap-3">
              {/* Pagination */}
              <div className="flex items-center gap-2">
                {tcProductOrderData?.data?.links?.map((link, index) => (
                  <button
                    key={index}
                    disabled={link.url === null || link.page === null}
                    onClick={() => link.page && setPage(link.page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      link.active
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "hover:bg-gray-100"
                    } ${
                      link.url === null || link.page === null
                        ? "text-gray-400 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
