import Cookies from "js-cookie";
import { roleSegment, roleDefaultPage } from "@/config";
import { useRouter } from "next/navigation";
import useAuth from "../useAuth";
import useClientApi from "../useClientApi";
import { toast } from "sonner";

// src/hooks/api/authApi.js
export const useLogin = ({ setNavigating } = {}) => {
  const { setToken, setSiteRoles, setActiveRole } = useAuth();
  const router = useRouter();

  return useClientApi({
    method: "post",
    key: ["login"],
    endpoint: "/api/users/login",
    onSuccess: data => {
      if (!data?.status) {
        setNavigating?.(false);
        toast.error(data?.message || "Login failed. Please try again.");
        return;
      }

      const { token, site_roles } = data.data;

      setToken(token);
      setSiteRoles(site_roles ?? []);
      Cookies.set("token", token, { sameSite: "strict" });
      setNavigating?.(true);

      if (!site_roles || site_roles.length === 0) {
        setActiveRole(null);
        Cookies.remove("role");
        Cookies.remove("allowed_sites");
        toast.success(data?.message || "Login Successful");
        router.push("/no-training-site");
        return;
      }

      const needsSelection = site_roles.length > 1;

      if (needsSelection) {
        router.push("/select-role");
      } else {
        const activeRole = site_roles[0];
        const segment = roleSegment[activeRole.role_name];
        const page = roleDefaultPage[activeRole.role_name];
        const isNoSite = segment === "student" || segment === "client";
        const firstTs = activeRole.training_site_id;

        Cookies.set("role", activeRole.role_name, { sameSite: "strict" });
        Cookies.set("allowed_sites", String(firstTs ?? ""), {
          sameSite: "strict",
        });

        setActiveRole(activeRole);

        const path = `/dashboard/${segment}/${page}`;
        router.push(path);
      }

      toast.success(data?.message || "Login Successful");
    },
    onError: err => {
      setNavigating?.(false);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useGetUserData = (token) => {
  return useClientApi({
    method: "get",
    key: ["user", token],
    enabled: !!token,
    endpoint: "/api/users/data",
    isPrivate: true,
    queryOptions: {
      retry: false,
    },
  });
};

export const useLogout = () => {
  const { clearToken } = useAuth();

  return useClientApi({
    method: "post",
    key: ["logout"],
    isPrivate: true,
    endpoint: "/api/users/logout",
    onSuccess: () => {
      clearToken();
      window.location.href = "/login";
    },
  });
};

export const useVerifyEmail = () => {
  return useClientApi({
    method: "post",
    isPrivate: false,
    endpoint: "/api/users/login/email-verify",
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useVerifyOTP = () => {
  return useClientApi({
    method: "post",
    isPrivate: false,
    endpoint: "/api/users/login/otp-verify",
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useResendOTP = () => {
  return useClientApi({
    method: "post",
    isPrivate: false,
    endpoint: "/api/users/login/otp-resend",
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useResetPassword = () => {
  return useClientApi({
    method: "post",
    isPrivate: false,
    endpoint: "/api/users/login/reset-password",
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};
