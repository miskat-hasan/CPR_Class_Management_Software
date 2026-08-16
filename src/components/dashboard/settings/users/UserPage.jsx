// src/components/dashboard/settings/users/UserPage.jsx
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBodyRow,
  TableButton,
  TableHead,
  TableFooter,
} from "@/components/common/TableElement";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { useDeleteUser, useGetAllUsers } from "@/hooks/api/dashboardApi";
import { PlusIcon, SearchIcon } from "@/components/svg/SvgContainer";
import { Check, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import DeleteUserConfirmModal from "@/components/dashboard/settings/users/DeleteUserConfirmModal";
import { HiOutlineTrash } from "react-icons/hi";

const UserPage = () => {
  const form = useForm();

  const { reset } = form;

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [enableSearch, setEnableSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: usersData, isLoading } = useGetAllUsers({
    page,
    perPage,
    roleIds: [1, 2, 3, 4, 7],
    ...(enableSearch && searchValue ? { search: searchValue } : {}),
  });

  const { mutate: deleteMutation, isPending: isDeletePending } =
    useDeleteUser();

  const onSubmit = data => {
    if (data?.search) {
      setSearchValue(data.search);
      setEnableSearch(true);
      setPage(1);
    }
  };

  const handleClearSearch = () => {
    setEnableSearch(false);
    setSearchValue("");
    setPage(1);
    reset({ search: "" });
  };

  const handleConfirmDelete = id => {
    deleteMutation(
      { endpoint: `/api/site-users/${id}` },
      {
        onSuccess: () => setSelectedUser(null),
        onError: () => setSelectedUser(null),
      },
    );
  };

  return (
    <>
      <section className="flex flex-col gap-[12.5px] lg:gap-[25px]">
        <div className="flex justify-between">
          <SectionTitle title="Users" />
          <Button
            asChild
            className="py-[11px] lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
          >
            <Link href="users/add-user">
              Add User
              <PlusIcon />
            </Link>
          </Button>
        </div>

        {/* Search */}
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="px-[16px] py-[16px] lg:px-[32px] lg:py-[32px] bg-white dark:bg-black rounded-[16px]">
            <div className="flex flex-wrap lg:flex-nowrap gap-[10px] xl:gap-[24px] items-end">
              <div className="flex-1 max-w-[400px]">
                <FormInput name="search" placeholder="Search users…" />
              </div>
              <div className="flex items-end gap-3">
                <Button
                  type="submit"
                  disabled={enableSearch && isLoading}
                  className="py-[12px] lg:py-[24px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
                >
                  <SearchIcon />
                  {enableSearch && isLoading ? "Searching…" : "Search"}
                </Button>
                {enableSearch && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-2 rounded-md bg-gray-100 dark:bg-transparent dark:border dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
                  >
                    <IoClose size={18} className="dark:text-gray" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </FormContainer>

        {/* Table */}
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px]">
          <SubSectionTitle subtitle="All list" />

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <tr>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Active
                    </th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Username
                    </th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Training Site &amp; Role
                    </th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Admin
                    </th>
                    <th className="px-3 md:px-6 py-3 whitespace-nowrap">
                      Last Activity
                    </th>
                    <th className="px-3 md:px-6 py-3 text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </TableHead>
                <tbody>
                  {usersData?.data?.data?.length > 0 ? (
                    usersData.data.data.map(user => (
                      <TableBodyRow key={user?.id}>
                        {/* Name + Email */}
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-sm dark:text-white">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                        </td>

                        {/* Active */}
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          {user?.active_user ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>

                        {/* Username */}
                        <td className="px-3 md:px-6 py-4 text-sm">
                          {user?.user_name ?? "—"}
                        </td>

                        {/* Training Site & Role */}
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {user?.user_roles?.length > 0 ? (
                              user.user_roles.map((ur, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 text-xs"
                                >
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {ur?.training_site?.training_center_name}
                                  </span>
                                  <span className="text-gray-400">·</span>
                                  <span className="text-brown dark:text-dark-brown font-medium">
                                    {ur?.role?.name}
                                  </span>
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">—</span>
                            )}
                          </div>
                        </td>

                        {/* Admin badge */}
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          {user?.user_roles?.some(
                            ur => ur?.role?.name === "Admin",
                          ) ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              TS
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Last Activity */}
                        <td className="px-3 md:px-6 py-4 text-sm whitespace-nowrap">
                          {user?.last_activity_at ?? (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-3 md:px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <TableButton
                              href={`/dashboard/super-admin/settings/users/${user?.id}/edit`}
                            >
                              <CiEdit className="text-gray-600 dark:text-gray text-[16px]" />
                            </TableButton>
                            <TableButton
                              isLink={false}
                              type="button"
                              onClick={() => setSelectedUser(user)}
                            >
                              <HiOutlineTrash className="text-gray-600 dark:text-gray text-[16px]" />
                            </TableButton>
                          </div>
                        </td>
                      </TableBodyRow>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
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

          {/* Pagination */}
          <TableFooter Links={usersData?.data?.links} setPage={setPage} />
        </div>
      </section>

      <DeleteUserConfirmModal
        user={selectedUser}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedUser(null)}
        isPending={isDeletePending}
      />
    </>
  );
};

export default UserPage;
