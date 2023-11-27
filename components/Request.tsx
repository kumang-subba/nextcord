"use client";
import { Friends, User } from "@prisma/client";
import UserAvatar from "./UserAvatar";
import { Check, Cross, X } from "lucide-react";
import { Tooltip } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RequestProps {
  type: "INCOMING" | "OUTGOING";
  requestId: string;
  friend: User;
}

const Request = ({ type, requestId, friend }: RequestProps) => {
  const router = useRouter();
  const { mutate: friendRequest, isPending } = useMutation({
    mutationFn: async ({ friendsId, type }: { friendsId: string; type: "ACCEPT" | "DECLINE" }) => {
      if (type === "ACCEPT") {
        const { data } = await axios.patch(`/api/friends/${friendsId}`);
        return data;
      } else if (type === "DECLINE") {
        const { data } = await axios.delete(`/api/friends/${friendsId}`);
        return data;
      }
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
  return (
    <div className="flex hover:bg-slate-600/40 px-4 py-2 items-center">
      <div className="flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold">
        <UserAvatar user={{ name: friend.username, image: friend.image || "" }} className="text-lg w-10 h-10 " />
        <span className="text-base -ml-2 truncate">{friend.username}</span>
      </div>
      <Tooltip content="Cancel Request" placement="top" color="primary" showArrow={true} radius="sm">
        <button
          className="flex items-center outline-none border-none focus:border-none focus:outline-none ring-0 group"
          onClick={() => friendRequest({ friendsId: requestId, type: "DECLINE" })}
          disabled={isPending}
        >
          <div className="flex mb-2 mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden items-center justify-center bg-neutral-700 group-hover:bg-rose-500">
            <X className="group-hover:text-white transition text-rose-500" size={25} />
          </div>
        </button>
      </Tooltip>
      {type === "INCOMING" ? (
        <Tooltip content="Accept Request" placement="top" color="primary" showArrow={true} radius="sm">
          <button
            className="flex items-center outline-none border-none focus:border-none focus:outline-none ring-0 group"
            onClick={() => friendRequest({ friendsId: requestId, type: "ACCEPT" })}
            disabled={isPending}
          >
            <div className="flex mb-2 mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden items-center justify-center bg-neutral-700 group-hover:bg-emerald-500">
              <Check className="group-hover:text-white transition text-emerald-500" size={25} />
            </div>
          </button>
        </Tooltip>
      ) : null}
    </div>
  );
};

export default Request;
