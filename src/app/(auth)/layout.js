// src/app/(auth)/layout.js
import AuthLayout from "@/components/layout/AuthLayout";

export default function DashboardLayout({ children }) {
  return (
    <AuthLayout>
      <div className="px-2">{children}</div>
    </AuthLayout>
  );
}
