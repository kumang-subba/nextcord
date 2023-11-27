"use client";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { UserPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const DashBoardAddFriend = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Button
      startContent={<UserPlus />}
      radius="sm"
      className={cn(
        "m-2 text-white",
        "transition",
        pathname === "/dashboard/add" ? "bg-emerald-800" : "bg-inherit text-emerald-400"
      )}
      onClick={() => {
        router.push("/dashboard/add");
      }}
    >
      Add friend
    </Button>
  );
};

export default DashBoardAddFriend;
