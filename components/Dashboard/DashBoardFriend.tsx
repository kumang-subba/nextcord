"use client";

import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../UserAvatar";

interface DashBoardFriendProps {
  friend: User;
}

const DashBoardFriend = ({ friend }: DashBoardFriendProps) => {
  const router = useRouter();

  const params = useParams();

  const onClick = () => {
    router.push(`/dashboard/chat/${friend.id}`);
  };

  return (
    <button
      className={cn(
        "group px-2 py-1 my-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1",
        params?.friendId === friend.id && "bg-zinc-700"
      )}
      onClick={onClick}
    >
      <UserAvatar user={{ name: friend.username, image: friend.image }} />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-base text-zinc-400 group-hover:text-zinc-300 transition ml-1",
          params?.friendId === friend.id && "text-primary text-zinc-200 group-hover:text-white"
        )}
      >
        {friend.username}
      </p>
    </button>
  );
};

export default DashBoardFriend;
