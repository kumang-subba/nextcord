"use client";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { UserCog } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../Providers/SocketProvider";

interface DashBoardFriendRequestsProps {
  unseenRequestCount: number;
  userId: string;
}

const DashBoardFriendRequests = ({ unseenRequestCount, userId }: DashBoardFriendRequestsProps) => {
  const [friendRequests, setFriendRequests] = useState<number>(unseenRequestCount);
  const [seen, setSeen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (pathname === "/dashboard/requests") {
      setSeen(true);
    }
  }, [pathname]);

  return (
    <Button
      startContent={<UserCog />}
      radius="sm"
      className={cn("m-2 text-white", pathname === "/dashboard/requests" ? "bg-zinc-700" : "bg-inherit")}
      onClick={() => router.push("/dashboard/requests")}
    >
      <p className="truncate text-white">Friend Requests</p>
      {!!(unseenRequestCount > 0) && !seen ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
          {friendRequests}
        </div>
      ) : null}
    </Button>
  );
};

export default DashBoardFriendRequests;
