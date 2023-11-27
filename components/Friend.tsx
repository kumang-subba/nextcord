"use client";

import { Tooltip } from "@nextui-org/react";
import { Friends, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Mail, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserAvatar from "./UserAvatar";

interface FriendProps {
  friend: User;
  friendshipId: string;
}

const Friend = ({ friend, friendshipId }: FriendProps) => {
  const router = useRouter();

  const { mutate: deleteFriend, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/friends/${friendshipId}`);

      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error("Something went wrong, Please try again.", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      }
    },
    onSuccess: () => {
      toast.success("Success", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      router.refresh();
    },
  });
  const messageFriend = () => {
    router.push(`/dashboard/chat/${friend.id}`);
  };
  return (
    <div className="flex hover:bg-slate-600/40 px-4 py-2 items-center">
      <div className="flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold">
        <UserAvatar user={{ name: friend?.username, image: friend.image || "" }} className="text-lg w-10 h-10 " />
        <span className="text-base -ml-2 truncate">{friend.username}</span>
      </div>
      <Tooltip content="Delete Friend" placement="top" color="primary" showArrow={true} radius="sm">
        <button
          className="flex items-center outline-none border-none focus:border-none focus:outline-none ring-0 group"
          onClick={() => deleteFriend()}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden items-center justify-center bg-neutral-700 group-hover:bg-rose-500">
            <Trash className="group-hover:text-white transition text-rose-500" size={25} />
          </div>
        </button>
      </Tooltip>
      <Tooltip content="Send Message" placement="top" color="primary" showArrow={true} radius="sm">
        <button
          className="flex items-center outline-none border-none focus:border-none focus:outline-none ring-0 group"
          onClick={messageFriend}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden items-center justify-center bg-neutral-700 group-hover:bg-blue-500">
            <Mail className="group-hover:text-white transition text-blue-500" size={25} />
          </div>
        </button>
      </Tooltip>
    </div>
  );
};

export default Friend;
