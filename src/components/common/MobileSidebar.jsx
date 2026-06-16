// src/components/dashboard/MobileSidebar.jsx
"use client";

import { DashboardIcon, Logo } from "@/components/svg/SvgContainer";
import { FaChevronRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useLogout } from "@/hooks/api/authApi";
import CustomSelect from "../shared/form/CustomSelect";
import { getSidebarMenu } from "@/config/sidebarConfig";
import { roleSegment } from "@/config";

const MobileSidebar = ({ onClose, isSidebarOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { ts } = useParams();

  const [openMenu, setOpenMenu] = useState(null);

  const {
    user,
    activeRole,
    accessibleSites,
    allSitesLoading,
    setSelectedTrainingSiteId,
  } = useAuth();

  const { mutateAsync: logoutAsync, isPending: logoutPending } = useLogout();

  const role = activeRole?.role_name;
  const menuItems = getSidebarMenu({ role, ts });

  // Format accessibleSites for CustomSelect
  const siteOptions = (accessibleSites ?? []).map(sr => ({
    id: sr.id ?? sr.training_site_id,
    name: sr.training_center_name ?? sr.training_site_name,
  }));

  // Auto-open active menu on pathname change
  useEffect(() => {
    if (!menuItems.length) return;
    for (const item of menuItems) {
      if (item.submenu?.some(sub => pathname.startsWith(sub.href))) {
        setOpenMenu(item.label);
        return;
      }
    }
  }, [pathname, menuItems.length]);

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [pathname]);

  const handleSiteChange = val => {
    setSelectedTrainingSiteId(val);

    const segment = roleSegment[role];
    const isSuperAdminOnMaster = role === "Super Admin" && String(val) === "1";
    const page = isSuperAdminOnMaster
      ? "class_and_students/upcoming_classes"
      : "class_and_students/classes";

    router.push(`/dashboard/${segment}/${val}/${page}`);
  };

  const handleLogout = async () => {
    await logoutAsync();
  };

  const isNoSiteRole = role === "Student" || role === "Client";

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 xl:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${
          isSidebarOpen ? "left-0" : "-left-full"
        } w-[280px] h-screen bg-white dark:bg-black text-black dark:text-gray duration-300 z-50 shadow-lg overflow-y-auto scroll-bar xl:hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-1.5">
            <Logo />
            <h5 className="font-black text-[14px] dark:text-gray">
              ENROLL NATIONWIDE
            </h5>
          </div>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-600 dark:text-gray cursor-pointer hover:text-brown transition"
          >
            ✕
          </button>
        </div>

        <div className="px-3 pt-3 flex flex-col gap-2">
          {/* Training site selector — hide for student/client */}
          {!isNoSiteRole && (
            <CustomSelect
              id="mobile-training-site"
              value={ts}
              options={siteOptions}
              isLoading={allSitesLoading}
              onChange={handleSiteChange}
              placeholder="Select training site"
            />
          )}

          {/* Dashboard label */}
          <div className="flex items-center gap-2 px-2 py-2">
            <DashboardIcon />
            <h6 className="font-medium dark:text-gray">Dashboard</h6>
          </div>

          {/* Nav */}
          <nav>
            <ul className="flex flex-col gap-0.5">
              {menuItems.map(item => {
                const isOpen = openMenu === item.label;

                return (
                  <li key={item.label}>
                    <button
                      onClick={() =>
                        setOpenMenu(p => (p === item.label ? null : item.label))
                      }
                      className={`flex justify-between items-center w-full px-3 py-2.5 rounded-[10px] text-left text-sm font-semibold transition-colors cursor-pointer ${
                        isOpen
                          ? "bg-brown dark:bg-dark-brown text-white"
                          : "hover:bg-gray-100 dark:hover:bg-dark dark:text-gray"
                      }`}
                    >
                      <span>{item.label}</span>
                      <FaChevronRight
                        className={`h-3 w-3 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all ${
                        isOpen ? "max-h-screen" : "max-h-0"
                      }`}
                    >
                      <ul className="bg-gray-50 dark:bg-dark rounded-[10px] pt-1 mt-0.5">
                        {item.submenu.map(sub => {
                          const active = pathname === sub.href;
                          return (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                className={`flex items-center pl-8 pr-4 py-2.5 text-xs relative ${
                                  active
                                    ? "text-gray-900 dark:text-white font-semibold"
                                    : "text-gray-600 dark:text-gray-400 hover:text-brown dark:hover:text-brown"
                                }`}
                              >
                                <span
                                  className={`absolute left-3 h-4 w-1 rounded-full ${
                                    active
                                      ? "bg-brown"
                                      : "bg-gray-200 dark:bg-gray-700"
                                  }`}
                                />
                                {sub.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              })}

              <button
                onClick={handleLogout}
                disabled={logoutPending}
                className="text-sm font-semibold mt-6 mb-4 cursor-pointer px-5 py-2.5 bg-brown dark:bg-dark-brown rounded-[10px] text-white text-center hover:bg-black transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
              >
                {logoutPending ? "Logging out..." : "Log Out"}
              </button>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
