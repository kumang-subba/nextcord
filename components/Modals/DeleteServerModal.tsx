"use client";

import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useModal } from "@/hooks/useModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;
  const router = useRouter();

  const { mutate: deleteServer, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/servers/${server?.id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully deleted", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      onClose();
      router.refresh();
      router.push("/");
    },
    onError: () => {
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
        <ModalHeader>Delete Server</ModalHeader>
        <ModalBody>
          <p className="text-lg font-medium">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-indigo-500 underline">{server?.name}</span> permanently?
          </p>
          <div className="pt-6 ml-auto flex gap-2">
            <Button color="danger" isLoading={isPending} isDisabled={isPending} onClick={() => deleteServer()}>
              Delete
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteServerModal;
