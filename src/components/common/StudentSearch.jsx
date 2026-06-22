// src/components/common/StudentSearch.jsx
"use client";

import React, { useState, useEffect } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import CustomSelect from "@/components/shared/form/CustomSelect";
import CustomInput from "@/components/shared/form/CustomInput";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/svg/SvgContainer";
import { searchStudent } from "@/hooks/api/dashboardApi";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

const StudentSearch = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // Filter states
  const [searchBy, setSearchBy] = useState("name");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [classId, setClassId] = useState("");

  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  const { data: studentData, isLoading } = searchStudent(
    page,
    perPage,
    firstName.trim(),
    lastName.trim(),
    email.trim().toLowerCase(),
    classId.trim(),
    searchTriggered,
  );

  useEffect(() => {
    setSearchTriggered(false);
  }, [studentData, firstName, lastName, email, phone, classId]);

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      {/* Header */}
      <div className="flex justify-between">
        <SectionTitle title={"Student Search Results"} />
      </div>

      {/* Search Filters */}
      <div className="px-[16px] py-[16px] lg:px-[32px] lg:py-[32px] bg-white dark:bg-black rounded-[16px] flex flex-wrap lg:flex-nowrap gap-[10px] xl:gap-[24px]">
        {/* Search By Dropdown */}
        <CustomSelect
          id="searchBy"
          label="Search By"
          placeholder="Select"
          value={searchBy}
          options={[
            { id: "name", name: "Name" },
            { id: "email", name: "Email" },
            { id: "phone", name: "Phone Number" },
            { id: "class_id", name: "Class Id" },
          ]}
          onChange={(val) => {
            setSearchBy(val);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setClassId("");
          }}
          className="w-[200px]"
        />

        {/* Dynamic Inputs */}
        {searchBy === "name" ? (
          <>
            <CustomInput
              id="firstName"
              label="First Name"
              placeholder="Enter first name"
              value={firstName}
              onChange={setFirstName}
              className="w-[200px]"
            />
            <CustomInput
              id="lastName"
              label="Last Name"
              placeholder="Enter last name"
              value={lastName}
              onChange={setLastName}
              className="w-[200px]"
            />
          </>
        ) : searchBy === "email" ? (
          <CustomInput
            id="email"
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={setEmail}
            className="w-[250px]"
          />
        ) : searchBy === "phone" ? (
          <CustomInput
            id="phone"
            label="Phone Number"
            placeholder="Enter phone number"
            value={phone}
            onChange={setPhone}
            className="w-[250px]"
          />
        ) : searchBy === "class_id" ? (
          <CustomInput
            id="class_id"
            label="Class ID"
            placeholder="Enter class ID"
            value={classId}
            onChange={setClassId}
            className="w-[250px]"
          />
        ) : null}

        {/* Search Button */}
        <div className="flex justify-end items-end">
          <Button
            onClick={handleSearch}
            className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
            disabled={isLoading}
          >
            <SearchIcon />
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All List" />
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full text-sm sm:text-base text-left text-gray-700">
              <thead className="bg-gray-50 text-black capitalize text-[16px] sm:text-[20px] font-semibold">
                <tr>
                  <th className="px-3 sm:px-6 py-3 w-[40px]">SL</th>
                  <th className="px-3 sm:px-6 py-3">Name</th>
                  <th className="px-3 sm:px-6 py-3">Reg Date</th>
                  <th className="px-3 sm:px-6 py-3">Phone</th>
                  <th className="px-3 sm:px-6 py-3">Class</th>
                  <th className="px-3 sm:px-6 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {studentData?.data?.data?.data?.length > 0 ? (
                  studentData?.data?.data?.data?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="px-3 sm:px-6 py-3 text-gray-800">
                        {index + 1}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-800 whitespace-nowrap">
                        <div>
                          <p className="font-medium">
                            {item.first_name} {item.last_name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {item.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.reg_date}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        {item.primary_phone}
                      </td>
                      <td className="px-3 sm:px-6 py-3 truncate max-w-[150px] sm:max-w-[250px]">
                        {item.class}
                      </td>
                      <td className="px-3 sm:px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "Complete"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : searchTriggered ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No results found
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Click Search to find students
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center justify-end mt-3 lg:mt-6 gap-3">
          {/* Pagination */}
          <div className="flex items-center gap-2">
            {studentData?.data?.links?.map((link, index) => (
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
      </div>
    </div>
  );
};

export default StudentSearch;
