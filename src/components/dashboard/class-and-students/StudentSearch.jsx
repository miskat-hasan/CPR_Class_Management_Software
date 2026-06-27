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
import {
  Table,
  TableBodyRow,
  TableHead,
} from "@/components/common/TableElement";

const StudentSearch = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchBy, setSearchBy] = useState("name");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [classId, setClassId] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleSearch = () => setSearchTriggered(true);

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

  const students = studentData?.data?.data?.data ?? [];
  const links = studentData?.data?.data?.links ?? [];
  const hasSearched = !searchTriggered && studentData !== undefined;

  return (
    <div className="flex flex-col gap-[12.5px] lg:gap-[25px]">
      <div className="flex justify-between">
        <SectionTitle title="Student Search Results" />
      </div>

      {/* Search Filters */}
      <div className="px-[16px] py-[16px] lg:px-[32px] lg:py-[32px] bg-white dark:bg-black rounded-[16px] flex flex-wrap lg:flex-nowrap gap-[10px] xl:gap-[24px] items-end">
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
          onChange={val => {
            setSearchBy(val);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setClassId("");
          }}
          className="max-w-[300px]"
        />

        {searchBy === "name" && (
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
        )}
        {searchBy === "email" && (
          <CustomInput
            id="email"
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={setEmail}
            className="w-[250px]"
          />
        )}
        {searchBy === "phone" && (
          <CustomInput
            id="phone"
            label="Phone Number"
            placeholder="Enter phone number"
            value={phone}
            onChange={setPhone}
            className="w-[250px]"
          />
        )}
        {searchBy === "class_id" && (
          <CustomInput
            id="class_id"
            label="Class ID"
            placeholder="Enter class ID"
            value={classId}
            onChange={setClassId}
            className="w-[250px]"
          />
        )}

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
        >
          <SearchIcon />
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Results Table */}
      <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
        <SubSectionTitle subtitle="All List" />

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-3 sm:px-6 py-3 w-[50px]">SL</th>
                  <th className="px-3 sm:px-6 py-3">Name</th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Reg Date
                  </th>
                  <th className="px-3 sm:px-6 py-3">Phone</th>
                  <th className="px-3 sm:px-6 py-3">Class</th>
                  <th className="px-3 sm:px-6 py-3">Status</th>
                </tr>
              </TableHead>
              <tbody>
                {students.length > 0 ? (
                  students.map((item, index) => (
                    <TableBodyRow key={index}>
                      <td className="px-3 sm:px-6 py-3">
                        {(page - 1) * perPage + index + 1}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <p className="font-medium dark:text-white">
                          {item.first_name} {item.last_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {item.email}
                        </p>
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
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "Complete"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                    >
                      {hasSearched
                        ? "No results found"
                        : "Click Search to find students"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {links.length > 0 && (
          <div className="flex items-center justify-end gap-2 flex-wrap">
            {links.map((link, index) => (
              <button
                key={index}
                disabled={link.url === null || link.page === null}
                onClick={() => link.page && setPage(link.page)}
                className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                  link.active
                    ? "border-brown text-brown bg-brown/10 dark:border-dark-brown dark:text-dark-brown dark:bg-dark-brown/10"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
                } ${
                  link.url === null || link.page === null
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;
