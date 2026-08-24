// src/Provider/AuthProvider/AuthProvider.jsx
"use client";
import { useGetUserData } from "@/hooks/api/authApi";
import { useGetUserTrainingSiteData } from "@/hooks/api/dashboardApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { setItem } from "@/lib/localStorage";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const AuthContextProvider = createContext(null);

const ensureArray = val => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return [];
};

export default function AuthProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken, clearToken] = useLocalStorage("token", null);
  const [_siteRoles, setSiteRoles] = useLocalStorage("site_roles", []);
  const [activeRole, setActiveRole] = useLocalStorage("active_role", null);

  const siteRoles = ensureArray(_siteRoles);

  const { data: userData, isLoading: loadingUserData } = useGetUserData(token);
  const { data: allSitesData, isLoading: allSitesLoading } =
    useGetUserTrainingSiteData(token);

  const roleName = activeRole?.role_name;

  const accessibleSites = (() => {
    if (!roleName) return [];

    if (allSitesData?.data && Array.isArray(allSitesData.data) && allSitesData.data.length > 0) {
      if (roleName === "Super Admin") {
        return allSitesData.data;
      }
      const allowedSiteIds = siteRoles
        .filter(sr => sr.role_name === roleName)
        .map(sr => String(sr.training_site_id ?? sr.id));

      return allSitesData.data.filter(site => {
        if (site.role_name) return site.role_name === roleName;
        const siteId = String(site.training_site_id ?? site.id);
        return allowedSiteIds.includes(siteId);
      });
    }

    if (roleName === "Super Admin" && siteRoles.length > 0) {
      return siteRoles;
    }

    return siteRoles.filter(sr => sr.role_name === roleName);
  })();

  const selectedTrainingSiteId = activeRole?.training_site_id ?? null;

  const isSiteActive = (() => {
    if (!selectedTrainingSiteId || !allSitesData?.data || !Array.isArray(allSitesData.data)) {
      return true;
    }
    const matchedSite = allSitesData.data.find(
      site => String(site.training_site_id ?? site.id) === String(selectedTrainingSiteId)
    );
    if (!matchedSite) return true;
    return matchedSite.is_active !== false;
  })();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("allowed_sites");
      return;
    }
    if (userData?.status) {
      setUser(userData.data);
      Cookies.set("token", token, { sameSite: "strict" });
    } else if (userData && !userData.status) {
      setUser(null);
    }
  }, [token, userData]);

  useEffect(() => {
    if (!activeRole) return;

    let allowedSites = "";
    if (activeRole.role_name === "Super Admin") {
      if (allSitesData?.data && Array.isArray(allSitesData.data) && allSitesData.data.length > 0) {
        allowedSites = allSitesData.data.map(sr => sr.training_site_id ?? sr.id).join(",");
      } else {
        const loginSites = siteRoles.filter(sr => sr.role_name === activeRole.role_name);
        allowedSites = loginSites.map(sr => sr.training_site_id ?? sr.id).join(",");
      }
    } else {
      const loginSites = siteRoles.filter(sr => sr.role_name === activeRole.role_name);
      allowedSites = loginSites.map(sr => sr.training_site_id ?? sr.id).join(",");
    }

    Cookies.set("role", activeRole.role_name, { sameSite: "strict" });
    if (allowedSites) {
      Cookies.set("allowed_sites", allowedSites, { sameSite: "strict" });
    }
    setItem("selected_site_id", activeRole.training_site_id);
  }, [activeRole?.role_name, activeRole?.training_site_id, siteRoles, allSitesData?.data]);

  const setSelectedTrainingSiteId = id => {
    if (!activeRole) return;
    setActiveRole({ ...activeRole, training_site_id: id });
    setItem("selected_site_id", id);
  };

  const clearAll = () => {
    clearToken();
    setSiteRoles([]);
    setActiveRole(null);
    setItem("selected_site_id", null);
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("allowed_sites");
  };

  return (
    <AuthContextProvider.Provider
      value={{
        hydrated,
        loading: loadingUserData,
        user,
        token,
        setToken,
        clearToken: clearAll,
        siteRoles,
        setSiteRoles,
        activeRole,
        setActiveRole,
        accessibleSites,
        allSitesLoading,
        selectedTrainingSiteId,
        setSelectedTrainingSiteId,
        isSiteActive,
      }}
    >
      {children}
    </AuthContextProvider.Provider>
  );
}
