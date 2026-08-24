// src/app/dashboard/layout.js
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardGuard from "@/components/layout/DashboardGuard";

export default function DashboardLayout({ children }) {
  return (
    <DashboardGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <Topbar />
          <div className="flex-1 overflow-y-auto px-6 py-10">{children}</div>
        </div>
      </div>
    </DashboardGuard>
  );
}
