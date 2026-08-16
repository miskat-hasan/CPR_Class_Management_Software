// src/components/dashboard/Sidebar.jsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { getSidebarMenu } from "@/config/sidebarConfig";
import { useLogout } from "@/hooks/api/authApi";
import useAuth from "@/hooks/useAuth";
import { Logo, DashboardIcon } from "@/components/svg/SvgContainer";
import SidebarSkeleton from "../skeleton/SidebarSkeleton";
import { roleSegment, roleDefaultPage } from "@/config";
import TrainingSiteSwitcher from "./TrainingSiteSwitcher";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    user,
    loading,
    activeRole,
    accessibleSites,
    allSitesLoading,
    setActiveRole,
    selectedTrainingSiteId,
    setSelectedTrainingSiteId,
  } = useAuth();

  const { mutateAsync: logout, isPending: logoutPending } = useLogout();

  const role = activeRole?.role_name;

  const menuItems = getSidebarMenu({ role, ts: selectedTrainingSiteId });

  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (!menuItems?.length) return;
    for (const item of menuItems) {
      if (item.submenu?.some(sub => pathname.startsWith(sub.href))) {
        setOpenMenu(item.label);
        return;
      }
    }
  }, [pathname, menuItems?.length]);

  const handleSiteChange = val => {
    const matchedSite = accessibleSites.find(
      sr => String(sr.training_site_id ?? sr.id) === String(val),
    );

    setActiveRole({ ...activeRole, ...matchedSite, training_site_id: val });

    // Always land back on the role's default page after switching sites.
    const segment = roleSegment[role];
    const page = roleDefaultPage[role];
    if (segment && page) {
      router.push(`/dashboard/${segment}/${page}`);
    }
  };

  if (loading || !user) return <SidebarSkeleton />;

  const siteOptions = accessibleSites.map(sr => ({
    id: sr.training_site_id ?? sr.id,
    name: sr.training_center_name ?? sr.training_site_name,
  }));

  return (
    <div className="max-w-[250px] xl:max-w-[300px] 2xl:max-w-[345px] w-full px-[17px] pt-[22.5px] h-screen overflow-y-auto scroll-bar bg-white dark:bg-black text-black hidden xl:flex xl:flex-col gap-[31.5px]">
      <div className="flex items-center gap-1.5 justify-center">
        <Logo />
        <h5 className="font-black text-[14px]">ENROLL NATIONWIDE</h5>
      </div>

      <div className="flex flex-col gap-2">
        {["Super Admin"].includes(role) && (
          <TrainingSiteSwitcher
            value={selectedTrainingSiteId}
            options={siteOptions}
            isLoading={allSitesLoading}
            onChange={handleSiteChange}
          />
        )}

        <div className="flex items-center gap-3 px-5 py-2.5">
          <DashboardIcon />
          <h6>Dashboard</h6>
        </div>

        <nav>
          <ul className="flex flex-col">
            {menuItems?.map(item => {
              const isOpen = openMenu === item.label;
              return (
                <li key={item.label} className="text-sm font-semibold">
                  <button
                    onClick={() =>
                      setOpenMenu(p => (p === item.label ? null : item.label))
                    }
                    className={`w-full flex items-center justify-between cursor-pointer px-5 py-3 rounded-[10px] transition-colors ${
                      isOpen
                        ? "bg-brown dark:bg-dark-brown text-white"
                        : "text-dark dark:text-gray hover:bg-gray-100 dark:hover:bg-dark"
                    }`}
                  >
                    <span>{item.label}</span>
                    <FaChevronRight
                      className={`h-3 w-3 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all ${isOpen ? "max-h-screen" : "max-h-0"}`}
                  >
                    <ul className="bg-gray-50 dark:bg-[#1B1D1E] rounded-[10px] pt-1">
                      {item?.submenu?.map(sub => {
                        const active = pathname === sub.href;
                        return (
                          <li key={sub?.label}>
                            <Link
                              href={sub.href}
                              prefetch={true}
                              className={`flex items-center pl-16 pr-6 py-2.5 text-xs relative ${
                                active
                                  ? "text-gray-900 dark:text-gray font-semibold"
                                  : "text-gray-600 dark:text-neutral-400 hover:text-brown dark:hover:text-red-400"
                              }`}
                            >
                              <span
                                className={`absolute left-6 h-5 w-1 rounded-full ${active ? "bg-brown dark:bg-dark-brown" : "bg-gray-200 dark:bg-[#25282A]"}`}
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
              onClick={() => logout()}
              disabled={logoutPending}
              type="button"
              key="logout"
              className="text-sm font-semibold mt-10 px-5 py-2.5 bg-brown dark:bg-dark-brown rounded-[10px] text-white cursor-pointer mb-4 hover:bg-black dark:hover:bg-brown transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {logoutPending ? "Logging out..." : "Log Out"}
            </button>
          </ul>
        </nav>
      </div>
    </div>
  );
}
