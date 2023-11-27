"use client";

import { cn } from "@/lib/utils";
import { AddFriendRequest } from "@/lib/validators/addFriend";
import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const AddFriend = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { mutate: addFriend, isPending } = useMutation({
    mutationFn: async ({ username }: AddFriendRequest) => {
      const payload: AddFriendRequest = {
        username,
      };
      const { data } = await axios.post("/api/friends", payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error("Invalid username", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
        if (error.response?.status === 401) {
          toast.error("Unauthorized", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
        if (error.response?.status === 409) {
          toast.error("You have already added this user", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      }
    },
    onSuccess: () => {
      toast.success("Friend request sent", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      router.refresh();
      setInput("");
    },
  });
  return (
    <div className="p-4 max-w-2xl">
      <Input
        autoFocus
        placeholder="Add friends with their NextCord username"
        variant="bordered"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        endContent={
          <Button
            radius="sm"
            type="button"
            onClick={() => {
              if (!input) return;
              addFriend({ username: input });
            }}
            className={cn(
              "w-full ",
              input.length === 0 ? "bg-blue-700/25 cursor-not-allowed text-gray-500" : "bg-blue-600 cursor-pointer"
            )}
            disabled={input.length === 0}
            isLoading={isPending}
          >
            Send Friend Request
          </Button>
        }
        startContent={<UserPlus className="h-10 w-10" />}
      />
    </div>
  );
};

export default AddFriend;
