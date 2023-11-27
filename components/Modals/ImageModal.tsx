"use client";

import { Modal, ModalBody, ModalContent } from "@nextui-org/react";

import { useModal } from "@/hooks/useModal";
import Image from "next/image";

const ImageModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { imageUrl } = data;
  const isModalOpen = isOpen && type === "imageModal";

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} className="text-foreground dark pb-4">
      <ModalContent>
        <ModalBody>
          <Image src={imageUrl!} alt="image" width={500} height={500} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
