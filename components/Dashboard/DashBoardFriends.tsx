"use client";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const DashBoardFriends = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Button
      startContent={<Users />}
      radius="sm"
      className={cn("m-2 text-white", pathname === "/dashboard/friends" ? "bg-zinc-700" : "bg-inherit")}
      onClick={() => router.push("/dashboard/friends")}
    >
      Friends
    </Button>
  );
};

export default DashBoardFriends;
