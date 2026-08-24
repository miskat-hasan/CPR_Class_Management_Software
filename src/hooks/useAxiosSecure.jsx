// src/hooks/useAxiosSecure.jsx
import axios from "axios";
import { getItem, removeItem } from "@/lib/localStorage";

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
});

axiosSecure.interceptors.request.use(
  (config) => {
    const token    = getItem("token");
    // const siteId   = getItem("selected_site_id");

    if (token)  config.headers["Authorization"] = `Bearer ${token}`;
    // if (siteId) config.headers["X-Site-Id"]     = siteId;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default function useAxiosSecure() {
  return axiosSecure;
}