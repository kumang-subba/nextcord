"use client";

import { Tooltip } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "../Icons";
import { cn } from "@/lib/utils";

const DashboardNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div>
      <Tooltip content="Direct messages" placement="right" color="primary" showArrow={true} radius="sm">
        <button
          className="group flex items-center relative outline-none border-none focus:border-none focus:outline-none ring-0"
          onClick={() => {
            if (pathname.split("/")[1] !== "dashboard") {
              router.push("/dashboard");
            }
            return;
          }}
        >
          <div
            className={cn(
              "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
              pathname.split("/")[1] !== "dashboard" && "group-hover:h-[20px]",
              pathname.split("/")[1] === "dashboard" ? "h-[36px]" : "h-[8px]"
            )}
          />
          <div
            className={cn(
              "flex mx-3 h-[48px] w-[48px] rounded-[24px]  transition-all overflow-hidden items-center justify-center bg-neutral-700",
              pathname.split("/")[1] !== "dashboard" && "group-hover:rounded-[16px]  group-hover:bg-blue-500",
              pathname.split("/")[1] === "dashboard" && "bg-blue-500 rounded-[16px]"
            )}
          >
            <Icons.logo className="w-10 h-10" />
          </div>
        </button>
      </Tooltip>
    </div>
  );
};

export default DashboardNavbar;
