import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { roleSegment, roleDefaultPage } from "@/config";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  // const cookieStore  = await cookies();
  // const token        = cookieStore.get("token")?.value;
  // const role         = cookieStore.get("role")?.value;
  // const allowedSites = cookieStore.get("allowed_sites")?.value;

  // if (token && role) {
  //   const segment     = roleSegment[role];
  //   const defaultPage = roleDefaultPage[role];
  //   const isNoSite    = segment === "student" || segment === "client";
  //   const firstSite   = allowedSites?.split(",")?.[0];

  //   if (segment && defaultPage) {
  //     const path = isNoSite
  //       ? `/dashboard/${segment}/${defaultPage}`
  //       : firstSite
  //         ? `/dashboard/${segment}/${firstSite}/${defaultPage}`
  //         : null;

  //     if (path) redirect(path);
  //   }
  // }

  return <LoginForm />;
}