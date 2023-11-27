"use client";

import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import qs from "query-string";

import { useModal } from "@/hooks/useModal";
import { ChannelType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Hash, Video, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;
  const router = useRouter();

  const { mutate: deleteChannelFn, isPending } = useMutation({
    mutationFn: async () => {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      const { data } = await axios.delete(url);
      return data;
    },
    onSuccess: () => {
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
      toast.success("Channel successfully deleted", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast.error("Channel already exists", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      }
      toast.error("Something went wrong, Please try again later.", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} className="text-foreground dark pb-4">
      <ModalContent>
        <ModalHeader>Delete Channel?</ModalHeader>
        <ModalBody>
          <p className="text-lg font-medium">
            Are you sure you want to permanently delete channel:{" "}
            <span className="font-semibold text-indigo-500 underline">{channel?.name}</span>?
          </p>
          <div className="pt-6 ml-auto flex gap-2">
            <Button color="danger" isLoading={isPending} isDisabled={isPending} onClick={() => deleteChannelFn()}>
              Delete
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteChannelModal;
