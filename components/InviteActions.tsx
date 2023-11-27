"use client";

import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface InviteActionsProps {
  inviteId: string;
}

const InviteActions = ({ inviteId }: InviteActionsProps) => {
  const router = useRouter();
  const { mutate: joinServer, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        inviteId,
      };
      const { data } = await axios.patch("/api/invite", payload);
      return data;
    },
    onError: (error) => {
      toast.error("Something went wrong, Please try again.", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      router.refresh();
    },
  });

  return (
    <div className="self-end flex gap-2">
      <Button color="danger" onClick={() => router.push("/dashboard")}>
        Cancel
      </Button>
      <Button color="primary" onClick={() => joinServer()} isLoading={isPending} isDisabled={isPending}>
        Accept
      </Button>
    </div>
  );
};

export default InviteActions;
