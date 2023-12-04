import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <DashboardSidebar />
      </div>
      <main className="h-screen md:pl-60 bg-[#393b3e]">
        <Suspense
          fallback={
            <div className="h-screen flex flex-col bg-[#393b3e] p-4 gap-4">
              <div className="h-14 rounded-lg bg-slate-700 animate-pulse" />
              <div className="flex-1 rounded-lg bg-slate-700 animate-pulse" />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </div>
  );
};

export default Layout;
