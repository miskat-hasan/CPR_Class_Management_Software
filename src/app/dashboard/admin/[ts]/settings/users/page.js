// "use client";
// import SectionTitle from "@/components/common/SectionTitle";
// import SubSectionTitle from "@/components/common/SubSectionTitle";
// import TableSkeleton from "@/components/skeleton/TableSkeleton";
// import FormContainer from "@/components/shared/form/FormContainer";
// import FormInput from "@/components/shared/form/FormInput";
// import { Button } from "@/components/ui/button";
// import { useDeleteUser, useGetAllUsers } from "@/hooks/api/dashboardApi";
// import { PlusIcon, SearchIcon } from "@/components/svg/SvgContainer";
// import { Check, Trash2 } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { CiEdit } from "react-icons/ci";
// import { IoClose } from "react-icons/io5";
// import DeleteUserConfirmModal from "@/components/dashboard/settings/DeleteUserConfirmModal";

import UserPage from "@/components/dashboard/settings/users/UserPage";

// const Page = () => {
//   const form = useForm();
//   const router = useRouter();
//   const { reset } = form;

//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [enableSearch, setEnableSearch] = useState(false);
//   const [searchValue, setSearchValue] = useState("");

//   const [selectedUser, setSelectedUser] = useState(null);

//   const { data: allInstructor, isLoading } = useGetAllUsers(
//     page,
//     perPage,
//     enableSearch,
//     searchValue,
//   );

//   const { mutate: deleteMutation, isPending: isDeletePending } =
//     useDeleteUser();

//   const onSubmit = (data) => {
//     if (data?.search) {
//       setSearchValue(data?.search);
//       setEnableSearch(true);
//     }
//   };

//   const handleClearSearch = () => {
//     setEnableSearch(false);
//     setSearchValue(null);
//     reset({ search: "" });
//   };

//   // Open delete confirmation modal
//   const handleDeleteClick = (user) => {
//     setSelectedUser(user);
//   };

//   // user delete handler & mutation
//   const handleConfirmDelete = (id) => {
//     deleteMutation(
//       { endpoint: `/api/site-users/${id}` },
//       {
//         onSuccess: () => {
//           setSelectedUser(null);
//         },
//         onError: () => {
//           setSelectedUser(null);
//         },
//       },
//     );
//   };

//   const handleCancelDelete = () => {
//     setSelectedUser(null);
//   };

//   return (
//     <>
//       <section className="flex flex-col gap-[13.5px] lg:gap-[25px]">
//         <div className="flex justify-between">
//           <SectionTitle title={"Users"} />
//           <Button
//             onClick={() => router.push("./users/add-user")}
//             className="py-[11px] text-[12px] lg:text-base lg:py-[22px] cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
//           >
//             Add User
//             <PlusIcon />
//           </Button>
//         </div>

//         <FormContainer form={form} onSubmit={onSubmit}>
//           <div className="px-[16px] py-[16px] lg:px-[32px] lg:py-[32px] bg-white dark:bg-black rounded-[16px]">
//             <div className="flex flex-wrap lg:flex-nowrap gap-[10px] xl:gap-[24px]">
//               <div className="flex-1 max-w-[400px]">
//                 <FormInput name="search" className={"w-full"} />
//               </div>
//               <div className="flex items-end gap-3">
//                 <Button
//                   type="submit"
//                   className="py-[12px] lg:py-[24px] text-[13px] lg:text-base cursor-pointer bg-brown dark:bg-dark-brown flex items-center gap-2"
//                   disabled={isLoading}
//                 >
//                   <SearchIcon />
//                   {isLoading ? "Searching ..." : "Search"}
//                 </Button>
//                 {enableSearch && (
//                   <button
//                     type="button"
//                     onClick={handleClearSearch}
//                     className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
//                   >
//                     <IoClose size={18} />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </FormContainer>

//         <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[24px]">
//           <div className="flex items-center justify-between">
//             <SubSectionTitle subtitle="All list" />
//           </div>

//           {isLoading ? (
//             <TableSkeleton />
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500">
//                       Name
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500">
//                       Active
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500">
//                       Username
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500">
//                       Training Site & role
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500">
//                       Admin
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500">
//                       Last Activity
//                     </th>
//                     <th className="py-3 px-4 text-xs font-bold uppercase text-gray-500 text-center">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-black divide-y divide-gray-200">
//                   {allInstructor?.data?.data?.length > 0 ? (
//                     allInstructor?.data?.data?.map((user) => (
//                       <tr key={user?.id} className="hover:bg-gray-50">
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <div className="font-semibold text-sm text-gray-900">
//                             {user?.name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {user?.email}
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           {user?.active_user && (
//                             <Check size={20} className="text-green-600" />
//                           )}
//                         </td>
//                         <td className="py-4 px-4 text-sm text-gray-700">
//                           {user?.username}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {user?.training_site?.training_center_name}
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 text-sm text-gray-700">
//                           {user?.roles?.find((item) => item?.name === "Admin")
//                             ? "TS"
//                             : "--"}
//                         </td>
//                         <td className="py-4 px-4 text-sm text-gray-700">
//                           {user?.lastActivity}
//                         </td>
//                         <td className="px-3 sm:px-6 py-3 text-center">
//                           <div className="flex items-center gap-2 justify-center">
//                             <Link
//                               href={`../instructors/instructor_records/${user?.id}`}
//                               className="p-1.5 sm:p-2 bg-gray-100 rounded-lg inline-block hover:bg-gray-200 transition"
//                             >
//                               <CiEdit className="text-gray-600 size-4" />
//                             </Link>
//                             <button
//                               type="button"
//                               onClick={() => handleDeleteClick(user)}
//                               className="p-1.5 sm:p-2 bg-gray-100 rounded-lg inline-block hover:bg-red-100 transition cursor-pointer"
//                             >
//                               <Trash2 className="text-gray-600 hover:text-red-600 size-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="7"
//                         className="text-center py-6 text-gray-500 italic"
//                       >
//                         No results found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <div className="flex flex-col md:flex-row items-center justify-end mt-3 lg:mt-6 gap-3">
//             {/* <div className="flex items-center gap-2">
//               <span className="text-gray-600 text-sm">Show:</span>
//               <select
//                 value={selectedShow}
//                 onChange={(e) => setSelectedShow(e.target.value)}
//                 className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none"
//               >
//                 <option value="10">10</option>
//                 <option value="25">25</option>
//                 <option value="50">50</option>
//               </select>
//             </div> */}
//             <div className="flex items-center gap-2">
//               {allInstructor?.data?.links?.map((link, index) => (
//                 <button
//                   key={index}
//                   disabled={link.url === null || link.page === null}
//                   onClick={() => link.page && setPage(link.page)}
//                   className={`px-3 py-1 text-sm border rounded-md ${
//                     link.active
//                       ? "border-blue-500 text-blue-600 bg-blue-50"
//                       : "hover:bg-gray-100"
//                   } ${
//                     link.url === null || link.page === null
//                       ? "text-gray-400 cursor-not-allowed"
//                       : "cursor-pointer"
//                   }`}
//                   dangerouslySetInnerHTML={{ __html: link.label }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Delete user modal */}
//       <DeleteUserConfirmModal
//         user={selectedUser}
//         onConfirm={handleConfirmDelete}
//         onCancel={handleCancelDelete}
//         isPending={isDeletePending}
//       />
//     </>
//   );
// };

// export default Page;

const Page = () => {
  return (
    <div>
      <UserPage />
    </div>
  );
};

export default Page;
