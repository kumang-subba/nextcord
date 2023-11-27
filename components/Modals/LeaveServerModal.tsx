"use client";

import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";

import { useModal } from "@/hooks/useModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;
  const router = useRouter();

  const { mutate: leaveServerFn, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/api/servers/${server?.id}/leave`);
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully left the server", {
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
        <ModalHeader>Leave Server</ModalHeader>
        <ModalBody>
          <p className="text-lg font-medium">
            Are you sure you want to leave server{" "}
            <span className="font-semibold text-indigo-500 underline">{server?.name}</span>?
          </p>
          <div className="pt-6 ml-auto flex gap-2">
            <Button color="danger" isLoading={isPending} isDisabled={isPending} onClick={() => leaveServerFn()}>
              Leave
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LeaveServerModal;
