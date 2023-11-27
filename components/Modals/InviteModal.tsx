"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";

import { useState } from "react";
import axios from "axios";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";

const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite`);
      onOpen("invite", { server: response.data });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} className="text-foreground dark pb-4">
      <ModalContent>
        <ModalHeader>Invite Friends</ModalHeader>
        <ModalBody>
          <p>Give your server a name and an image. You can change them later.</p>
          <div className="py-6">
            <p className="uppercase text-xs font-bold">Server invite link</p>
            <div className="flex items-center mt-2 gap-x-2">
              <Input disabled={isLoading} variant="bordered" value={inviteUrl} size="sm" />
              <Button onClick={onCopy} disabled={isLoading} isIconOnly aria-label="Copy">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              size="sm"
              className="text-xs mt-4 disabled:text-gray-500 disabled:cursor-pointer"
              isDisabled={isLoading}
              onClick={onNew}
              endContent={<RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />}
            >
              Generate a new link
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
