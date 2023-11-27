"use client";

import qs from "query-string";

import { useModal } from "@/hooks/useModal";
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.delete(url);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} className="text-foreground dark pb-4">
      <ModalContent>
        <ModalHeader>Delete Message?</ModalHeader>
        <ModalBody>
          <p className="text-lg font-medium">Are you sure you want to permanently the message?</p>
          <div className="pt-6 ml-auto flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button color="danger" isLoading={isLoading} isDisabled={isLoading} onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteMessageModal;
