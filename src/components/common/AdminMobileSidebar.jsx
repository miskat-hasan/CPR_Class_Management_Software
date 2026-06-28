"use client";
import { DashboardIcon, Logo } from "@/components/svg/SvgContainer";
import { FaChevronRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { useLogout } from "@/hooks/api/authApi";
import CustomSelect from "../shared/form/CustomSelect";

const AdminMobileSidebar = ({ onClose, isSidebarOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const trainingSiteId = params.ts;

  const form = useForm();
  const { control } = form;

  const [openMenu, setOpenMenu] = useState(null);

  const {
    user,
    trainingSiteData,
    trainingSiteDataLoading,
    selectedTrainingSiteId,
    setSelectedTrainingSiteId,
  } = useAuth();

  const menuItems = [
    {
      label: "Classes",
      href: "#",
      submenu: [
        {
          label: "Classes",
          href: `/admin/${selectedTrainingSiteId}/class-and-students/classes`,
        },
        {
          label: "Student Search",
          href: `/admin/${selectedTrainingSiteId}/class-and-students/student_search`,
        },
        // {
        //   label: "Student Export",
        //   href: `/admin/${selectedTrainingSiteId}/student_export`,
        // },
        {
          label: "TC Product Orders",
          href: `/admin/${selectedTrainingSiteId}/tc_product_orders`,
        },
      ],
    },
    {
      label: "Settings",
      href: "#",
      submenu: [
        {
          label: "Course Type",
          href: `/admin/${selectedTrainingSiteId}/settings/course_type`,
        },
        {
          label: "Locations",
          href: `/admin/${selectedTrainingSiteId}/settings/location`,
        },
        {
          label: "Card Settings",
          href: `/admin/${selectedTrainingSiteId}/settings/cards_settings`,
        },
        {
          label: "Connect Account",
          href: `/admin/${selectedTrainingSiteId}/settings/connect-account`,
        },
        // {
        //   label: "Users",
        //   href: `/admin/${selectedTrainingSiteId}/settings/users`,
        // },
      ],
    },
    {
      label: "Help",
      href: "#",
      submenu: [
        // { label: "Search Help", href: "https://help.enrollware.com/" },
        {
          label: "Support Request",
          href: `/admin/${selectedTrainingSiteId}/help/support_request`,
        },
        {
          label: "Whats New",
          href: `/admin/${selectedTrainingSiteId}/help/whats_new`,
        },
      ],
    },
  ];

  useEffect(() => {
    for (const item of menuItems) {
      if (
        item.submenu &&
        item.submenu.some(sub => pathname.startsWith(sub.href))
      ) {
        setOpenMenu(item.label);
        return;
      }
    }
  }, [pathname, user]);

  const toggleMenu = label => {
    setOpenMenu(prev => (prev === label ? null : label));
  };

  const handleSelectChange = val => {
    setSelectedTrainingSiteId(val);

    return router.push(`/admin/${val}/class-and-students/classes`);
  };

  // logout
  const { mutateAsync: logoutAsync, isPending: logoutPending } = useLogout();

  const handleLogout = async () => {
    await logoutAsync();
  };

  return (
    <div
      className={`fixed top-0 ${
        isSidebarOpen ? "left-0" : "-left-full"
      } w-[280px] h-screen bg-white dark:bg-black text-black duration-300 z-50 shadow-lg overflow-y-auto scroll-bar`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <Logo />
          <h5 className="font-black text-[14px]">ENROLL NATIONWIDE</h5>
        </div>
        <button
          onClick={onClose}
          className="text-xl font-bold text-gray-600 cursor-pointer"
        >
          ✕
        </button>
      </div>
      <div className="px-3 pt-3">
        <Controller
          name="training-site"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              id="training-site"
              value={trainingSiteId ?? selectedTrainingSiteId}
              options={trainingSiteData?.data}
              isLoading={trainingSiteDataLoading}
              onChange={handleSelectChange}
              placeholder="select training site"
              className="flex-1 mb-2"
            />
          )}
        />
      </div>
      {/* Menu */}
      <nav className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <DashboardIcon />
          <h6 className="font-medium">Dashboard</h6>
        </div>

        <ul>
          {menuItems.map(item => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isMenuOpen = openMenu === item.label;

            return (
              <li key={item.label} className="mb-1">
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`flex justify-between items-center w-full px-2 py-2 rounded-lg text-left ${
                        isMenuOpen
                          ? "bg-brown dark:bg-dark-brown text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span>{item.label}</span>
                      <FaChevronRight
                        className={`h-3 w-3 transition-transform ${
                          isMenuOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    <ul
                      className={`overflow-hidden transition-all duration-300 ${
                        isMenuOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      {item.submenu.map(subItem => {
                        const active = pathname === subItem.href;
                        return (
                          <li key={subItem.label}>
                            <Link
                              href={subItem.href}
                              onClick={onClose}
                              className={`block pl-8 pr-4 py-2 text-sm ${
                                active
                                  ? "text-brown font-semibold"
                                  : "text-gray-600 hover:text-brown"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block px-4 py-2 rounded-lg ${
                      pathname === item.href
                        ? "bg-brown dark:bg-dark-brown text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
          <button
            onClick={handleLogout}
            className="text-sm font-semibold mt-10 cursor-pointer px-[20px] py-[10px] bg-brown dark:bg-dark-brown rounded-[10px] text-white text-center"
            disabled={logoutPending}
          >
            {logoutPending ? "logging out ..." : "Log Out"}
          </button>
        </ul>
      </nav>
    </div>
  );
};

export default AdminMobileSidebar;
