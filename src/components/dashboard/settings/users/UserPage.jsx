// src/components/dashboard/settings/users/UserPage.jsx
"use client";

import SectionTitle from "@/components/common/SectionTitle";
import SubSectionTitle from "@/components/common/SubSectionTitle";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import FormContainer from "@/components/shared/form/FormContainer";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { useDeleteUser, useGetAllUsers } from "@/hooks/api/dashboardApi";
import { PlusIcon, SearchIcon } from "@/components/svg/SvgContainer";
import { Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import DeleteUserConfirmModal from "@/components/dashboard/settings/users/DeleteUserConfirmModal";

const UserPage = () => {
  const form = useForm();
  const router = useRouter();
  const { reset } = form;

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [enableSearch, setEnableSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Paginated — no type="all", no role_id filter (show every user)
  const { data: usersData, isLoading } = useGetAllUsers({
    page,
    per_page: perPage,
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

  const handleDeleteClick = user => setSelectedUser(user);
  const handleCancelDelete = () => setSelectedUser(null);

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
      <section className="flex flex-col gap-[13.5px] lg:gap-[25px]">
        <div className="flex justify-between">
          <SectionTitle title="Users" />
          <Button
            onClick={() => router.push("./users/add-user")}
            className="py-[11px] text-[12px] lg:text-base lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
          >
            Add User
            <PlusIcon />
          </Button>
        </div>

        {/* Search bar */}
        <FormContainer form={form} onSubmit={onSubmit}>
          <div className="px-[16px] py-[16px] lg:px-[32px] lg:py-[32px] bg-white dark:bg-black rounded-[16px]">
            <div className="flex flex-wrap lg:flex-nowrap gap-[10px] xl:gap-[24px]">
              <div className="flex-1 max-w-[400px]">
                <FormInput
                  name="search"
                  className="w-full"
                  placeholder="Search users…"
                />
              </div>
              <div className="flex items-end gap-3">
                <Button
                  type="submit"
                  className="py-[12px] lg:py-[24px] text-[13px] lg:text-base cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
                  disabled={enableSearch && isLoading}
                >
                  <SearchIcon />
                  {enableSearch && isLoading ? "Searching…" : "Search"}
                </Button>
                {enableSearch && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-2 rounded-md bg-gray-100 dark:bg-transparent dark:border dark:border-gray-700 hover:bg-gray-200 transition cursor-pointer"
                  >
                    <IoClose size={18} className="dark:text-gray" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </FormContainer>

        {/* Table */}
        <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
          <div className="flex items-center justify-between">
            <SubSectionTitle subtitle="All list" />
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {[
                      "Name",
                      "Active",
                      "Username",
                      "Training Site & Role",
                      "Admin",
                      "Last Activity",
                      "Action",
                    ].map(h => (
                      <th
                        key={h}
                        className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500 dark:text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                  {usersData?.data?.data?.length > 0 ? (
                    usersData.data.data.map(user => (
                      <tr
                        key={user?.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                      >
                        {/* Name + Email */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">
                            {user?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user?.email}
                          </div>
                        </td>

                        {/* Active */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {user?.active_user ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <span className="text-gray-400 text-sm">--</span>
                          )}
                        </td>

                        {/* Username */}
                        <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                          {user?.user_name ?? "--"}
                        </td>

                        {/* Training Site & Role */}
                        <td className="py-4 px-4">
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
                                  <span className="text-brown font-medium">
                                    {ur?.role?.name}
                                  </span>
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">--</span>
                            )}
                          </div>
                        </td>

                        {/* Admin */}
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {user?.user_roles?.some(
                            ur => ur?.role?.name === "Admin",
                          ) ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              TS
                            </span>
                          ) : (
                            <span className="text-gray-400">--</span>
                          )}
                        </td>

                        {/* Last Activity */}
                        <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                          {user?.last_activity_at ?? (
                            <span className="text-gray-400">--</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Link
                              href={`./users/${user?.id}/edit`}
                              className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                              <CiEdit className="text-gray-600 dark:text-gray-300 size-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(user)}
                              className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block hover:bg-red-100 dark:hover:bg-red-900/30 transition cursor-pointer"
                            >
                              <Trash2 className="text-gray-600 dark:text-gray-300 hover:text-red-600 size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 mt-3">
            {usersData?.data?.links?.map((link, index) => (
              <button
                key={index}
                disabled={link.url === null || link.page === null}
                onClick={() => link.page && setPage(link.page)}
                className={`px-3 py-1 text-sm border rounded-md transition ${
                  link.active
                    ? "border-brown text-brown bg-brown/5"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700"
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
      </section>

      <DeleteUserConfirmModal
        user={selectedUser}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isPending={isDeletePending}
      />
    </>
  );
};

export default UserPage;
