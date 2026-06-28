"use client";
import { DashboardIcon, Logo } from "@/components/svg/SvgContainer";
import { FaChevronRight } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

import { useLogout } from "@/hooks/api/authApi";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "@/components/shared/form/CustomSelect";

const AdminDashboardSidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const trainingSiteId = params.ts;

  const form = useForm();

  const { control } = form;

  const [openMenu, setOpenMenu] = useState(null);

  const router = useRouter();

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
          href: `/admin/${trainingSiteId}/class-and-students/classes`,
        },
        {
          label: "Student Search",
          href: `/admin/${trainingSiteId}/class-and-students/student_search`,
        },
        // {
        //   label: "Student Export",
        //   href: `/admin/${trainingSiteId}/class-and-students/student_export`,
        // },
        {
          label: "TS Product Orders",
          href: `/admin/${trainingSiteId}/class-and-students/ts_product_orders`,
        },
      ],
    },
    {
      label: "Settings",
      href: "#",
      submenu: [
        {
          label: "Course Type",
          href: `/admin/${trainingSiteId}/settings/course_type`,
        },
        {
          label: "Locations",
          href: `/admin/${trainingSiteId}/settings/location`,
        },
        {
          label: "Card Settings",
          href: `/admin/${trainingSiteId}/settings/cards_settings`,
        },
        {
          label: "Connect Account",
          href: `/admin/${trainingSiteId}/settings/connect-account`,
        },
        // {
        //   label: "Users",
        //   href: `/admin/${trainingSiteId}/settings/users`,
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
          href: `/admin/${trainingSiteId}/help/support_request`,
        },
        {
          label: "Whats New",
          href: `/admin/${trainingSiteId}/help/whats_new`,
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
  }, [pathname, user, trainingSiteId]);

  const handleSelectChange = val => {
    setSelectedTrainingSiteId(val);

    return router.push(`/admin/${val}/class-and-students/classes`);
  };

  const toggleMenu = label => {
    setOpenMenu(prev => (prev === label ? null : label));
  };

  const { mutateAsync: logoutAsync, isPending: logoutPending } = useLogout();

  const handleLogout = async () => {
    await logoutAsync();
  };

  return (
    <div className="max-w-[250px] xl:max-w-[300px] 2xl:max-w-[345px] w-full px-[17px] pt-[22.5px] h-screen overflow-y-auto scroll-bar bg-white dark:bg-black text-black hidden xl:flex xl:flex-col gap-[31.5px]">
      <div className="flex items-center gap-1.5 justify-center">
        <Logo />
        <h5 className="font-black text-[14px]">ENROLL NATIONWIDE</h5>
      </div>

      <div className="flex flex-col">
        <Controller
          name="training-site"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              id="training-site"
              value={selectedTrainingSiteId}
              options={trainingSiteData?.data}
              isLoading={trainingSiteDataLoading}
              onChange={handleSelectChange}
              placeholder="select training site"
              className="flex-1 mb-2"
            />
          )}
        />
        <div className="flex items-center gap-[12px] px-[20px] py-[10px]">
          <DashboardIcon />
          <h6>Dashboard</h6>
        </div>

        {/* Dynamic Menu */}
        <nav className="flex-grow">
          <ul>
            {menuItems.map(item => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isOpen = openMenu === item.label;

              return (
                <li key={item.label} className="text-sm font-semibold">
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between px-5 py-3 rounded-[10px] transition-colors ${
                        isOpen
                          ? "bg-brown dark:bg-dark-brown text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span>{item.label}</span>
                      <FaChevronRight
                        className={`h-3 w-3 ${isOpen ? "rotate-90" : ""}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`w-full block px-5 py-3 rounded-[10px] ${
                        pathname === item.href
                          ? "bg-brown dark:bg-dark-brown text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {hasSubmenu && (
                    <div
                      className={`transition-all overflow-hidden ${
                        !isOpen && "max-h-0"
                      }`}
                    >
                      <ul className="bg-gray-50 rounded-[10px] pt-1">
                        {item.submenu.map(sub => {
                          const active = pathname === sub.href;
                          return (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                className={`flex items-center pl-16 pr-6 py-2.5 text-xs relative ${
                                  active
                                    ? "text-gray-900 font-semibold"
                                    : "text-gray-600 hover:text-brown"
                                }`}
                              >
                                <span
                                  className={`absolute left-6 h-5 w-1 rounded-full ${
                                    active
                                      ? "bg-brown dark:bg-dark-brown"
                                      : "bg-gray-200"
                                  }`}
                                ></span>
                                {sub.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
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
    </div>
  );
};

export default AdminDashboardSidebar;
