"use client";
import { NotificationIcon } from "@/components/svg/SvgContainer";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import MobileSidebar from "../common/MobileSidebar";
import useAuth from "@/hooks/useAuth";
import AdminMobileSidebar from "../common/AdminMobileSidebar";
import { FaRegUser } from "react-icons/fa";
import { useParams } from "next/navigation";
import ThemeToggle from "../common/ThemeToggle";

const DashboardTopbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, userData, loadingUserData } = useAuth();

  const params = useParams();
  const trainingSiteId = params.ts;

  const handleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative flex justify-between xl:justify-end items-center px-3 md:px-7">
      <button onClick={handleSidebar} className="xl:hidden block z-50 relative">
        <CgMenuLeft className="text-3xl hover:text-brown cursor-pointer dark:text-gray" />
      </button>

      {/* Right-side icons */}
      <div className="flex items-center gap-2.5 py-3">
        <ThemeToggle />
        <Link
           href={
            user?.roles?.find((item) => item?.role_name === "Super Admin")
              ? `/super-admin/${trainingSiteId}/notifications`
              : `/admin/${trainingSiteId}/notifications`
          }
          className="w-[40px] h-[40px] lg:w-[60px] lg:h-[60px] bg-white dark:bg-black rounded-[14px] flex items-center justify-center dark:text-gray"
        >
          <NotificationIcon />
        </Link>

        {/* User Info */}
        <Link
          href={
            user?.roles?.find((item) => item?.role_name === "Super Admin")
              ? `/super-admin/${trainingSiteId}/manage_profile`
              : `/admin/${trainingSiteId}/manage_profile`
          }
          className="h-auto lg:h-[60px] bg-white dark:bg-black rounded-[14px] flex items-center p-1 w-auto gap-[11px]"
        >
          {/* Avatar */}
          <div className="w-[30px] h-[30px] lg:w-[50px] lg:h-[50px] overflow-hidden rounded-[11px]">
            {loadingUserData ? (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-[11px]" />
            ) : user?.avatar ? (
              <Image
                src={user?.avatar}
                width={64}
                height={64}
                alt="User picture"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="border dark:border-[#282B2D] size-full rounded-2xl flex items-center justify-center">
                <FaRegUser className="size-6 text-black dark:text-gray" />
              </div>
            )}
          </div>

          {/* Name & ID */}
          <div className="flex flex-col pr-[12px] min-w-[90px]">
            {loadingUserData ? (
              <>
                <div className="h-[16px] lg:h-[20px] w-[70px] bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-[10px] lg:h-[12px] w-[90px] bg-gray-200 rounded animate-pulse" />
              </>
            ) : (
              user && (
                <>
                  <h6 className="text-[16px] lg:text-xl font-medium">
                    {user?.name || "—"}
                  </h6>
                  <p className="text-[10px] lg:text-[12px] text-[#8C8C8C]">
                    ID: {user?.id || "—"}
                  </p>
                </>
              )
            )}
          </div>
        </Link>
      </div>

      {/* Mobile Sidebar */}
      {user?.roles?.find((item) => item?.role_name === "Super Admin") && (
        <MobileSidebar isSidebarOpen={isSidebarOpen} onClose={handleSidebar} />
      )}

      {user?.roles?.find(
        (item) => item?.role_name !== "Super Admin",
      ) && (
        <AdminMobileSidebar
          isSidebarOpen={isSidebarOpen}
          onClose={handleSidebar}
        />
      )}

      {isSidebarOpen && (
        <div
          onClick={handleSidebar}
          className="fixed inset-0 bg-gray/20 z-40 xl:hidden"
        />
      )}
    </div>
  );
};

export default DashboardTopbar;
