"use client";

import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  useGetStudentByClassId,
  useUpdateStudentScore,
} from "@/hooks/api/dashboardApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BackButton from "@/components/common/BackButton";
import { useParams } from "next/navigation";

const EditScore = () => {
  const { id } = useParams();

  const form = useForm({
    defaultValues: {
      students: [],
    },
  });

  const statusData = [
    {
      id: "Pending",
      name: "Pending",
    },
    {
      id: "Complete",
      name: "Complete",
    },
    {
      id: "Cancelled",
      name: "Cancelled",
    },
  ];

  const {
    reset,
    register,
  } = form;

  // get student data
  const { data: studentData, isLoading: studentDataLoading } =
    useGetStudentByClassId(id);

  useEffect(() => {
    if (studentData) {
      reset({
        students: studentData.data.students.map(s => ({
          id: s.id,
          status: s.status,
          score: s.score,
        })),
      });
    }
  }, [studentData, reset]);

  const { mutate, isPending } = useUpdateStudentScore();

  const onSubmit = data => {
    const payload = {
      course_id: Number(id),
      students: data.students.map(s => ({
        id: s.id,
        status: s.status,
        score: s.score,
      })),
    };

    mutate(payload, {
      onSuccess: data => {
        toast.success(data?.message);
      },
    });
  };

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between"></div>

      {/* Table Container */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-zinc-950 border border-transparent dark:border-zinc-800 rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="Update Student Score" />
        {studentDataLoading ? (
          <TableSkeleton />
        ) : (
          <FormContainer form={form} onSubmit={onSubmit} className={"mt-5"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base text-left text-gray-700 dark:text-zinc-300 min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-zinc-900 text-black dark:text-zinc-100 capitalize text-[16px] sm:text-[18px] font-semibold border-b border-transparent dark:border-zinc-800">
                  <tr>
                    <th className="px-3 sm:px-6 py-3">Student</th>
                    <th className="px-3 sm:px-6 py-3">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-center">
                      Test Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentData?.data?.students?.length > 0 ? (
                    studentData?.data?.students?.map((item, index) => (
                      <tr
                        key={item?.id}
                        className="border-b border-gray-200 dark:border-zinc-800/80 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all"
                      >
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                          <p className="font-medium text-gray-900 dark:text-zinc-100">
                            {item?.first_name} {item?.last_name}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-zinc-400">
                            {item?.email}
                          </p>
                        </td>
                        <td className="px-3 sm:px-6 py-3 text-gray-800 dark:text-zinc-200 whitespace-nowrap">
                          <select
                            {...register(`students.${index}.status`)}
                            className="w-full rounded-xl sm:rounded-2xl px-3 py-2.5 text-sm sm:text-base font-normal leading-[1.45] bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-all duration-150 cursor-pointer"
                          >
                            {statusData.map((item, idx) => (
                              <option
                                key={idx}
                                value={item.id}
                                className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100"
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 sm:px-6 py-3 text-center space-x-2">
                          <FormInput name={`students.${index}.score`} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-6 text-gray-500 dark:text-zinc-500 italic"
                      >
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Form Action Controls */}
            <div className="flex justify-end gap-4 mt-5 lg:mt-10">
              <BackButton />
              <Button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-brown dark:bg-dark-brown hover:opacity-90 transition focus:outline-none"
              >
                {isPending ? "Updating..." : "Update Score"}
              </Button>
            </div>
          </FormContainer>
        )}
      </div>
    </div>
  );
};

export default EditScore;
