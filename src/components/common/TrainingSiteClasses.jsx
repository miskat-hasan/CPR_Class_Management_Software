"use client";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
} from "@/components/common/TableElement";
import { getAllClasses } from "@/hooks/api/dashboardApi";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { GoArrowUpRight } from "react-icons/go";

const TrainingSiteClasses = () => {
  const { trainingSiteData, trainingSiteDataLoading, selectedTrainingSiteId } =
    useAuth();

  const { data: classData, isLoading: classLoading } = getAllClasses();

  const [selectedTrainingSiteData, setSelectedTrainingSiteData] =
    useState(null);

  const [filteredClasses, setFilteredClasses] = useState(null);

  useEffect(() => {
    let data = null;
    if (selectedTrainingSiteId) {
      data = trainingSiteData?.data?.find(
        (item) => item?.id == selectedTrainingSiteId,
      );
    }

    if (trainingSiteData?.data && !trainingSiteDataLoading) {
      setSelectedTrainingSiteData(
        data?.classes ?? trainingSiteData?.data?.[0]?.classes,
      );
    }
    if (selectedTrainingSiteData) {
      setFilteredClasses(selectedTrainingSiteData);
    }
  }, [
    trainingSiteData,
    trainingSiteDataLoading,
    selectedTrainingSiteId,
    selectedTrainingSiteData,
  ]);

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Classes"} />
      </div>
      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All Lists" />
        {classLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 sm:px-6 py-3">Date/Time</th>
                  <th className="px-3 sm:px-6 py-3">Course</th>
                  <th className="px-3 sm:px-6 py-3">Instructor</th>
                  <th className="px-3 sm:px-6 py-3">Location</th>
                  <th className="px-3 sm:px-6 py-3">Students</th>
                  <th className="px-3 sm:px-6 py-3 text-center">Action</th>
                </tr>
              </TableHead>
              <tbody>
                {classData?.data?.data?.length > 0 ? (
                  classData?.data?.data?.map((item) => (
                    <TableBodyRow key={item?.id}>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap dark:text-gray-200">
                        {item?.class_times?.[0]?.date}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap font-medium">
                        {item?.course?.course_name}
                      </td>

                      <td className="px-3 sm:px-6 py-3 truncate max-w-[160px] sm:max-w-[220px] dark:text-gray-300">
                        {item?.instructor?.first_name}{" "}
                        {item?.instructor?.last_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 truncate max-w-[160px] sm:max-w-[220px] dark:text-gray-300">
                        {item?.location_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-600 dark:text-gray-400">
                        {item?.enrollments_count ?? "0"}/{item?.max_student}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <div className="flex items-center flex-nowrap gap-2 justify-center">
                          <TableButton href={`classes/${item.id}`}>
                            <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                          </TableButton>
                          <TableButton href={`classes/roster/${item.id}`}>
                            <GoArrowUpRight className="text-gray-600 dark:text-gray text-[16px]" />
                          </TableButton>
                        </div>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingSiteClasses;
