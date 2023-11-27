"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tooltip,
} from "@nextui-org/react";

import { useModal } from "@/hooks/useModal";
import { ServerWithMembersWithUsers } from "@/types/db";
import { Session } from "next-auth";
import { useState } from "react";
import { Icons } from "../Icons";
import UserAvatar from "../UserAvatar";
import { ScrollArea } from "../ui/scroll-area";

import { MemberRole } from "@prisma/client";
import axios from "axios";
import { MoreVertical, Shield, ShieldAlert, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import toast from "react-hot-toast";

const MembersModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();
  const isModalOpen = isOpen && type === "members";
  const { server, session } = data as { server: ServerWithMembersWithUsers; session: Session };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: response.data, session });
    } catch (err) {
      toast.error("Something went wrong, Please try again.", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      console.log(err);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} className="text-foreground dark pb-4">
      <ModalContent>
        <ModalHeader className="flex items-center justify-center">Manage Members</ModalHeader>
        <ModalBody>
          <p className="text-center">{server?.members.length} Members</p>
          <div className="p-6">
            <ScrollArea className="mt-6 max-h-[420px] pr-6">
              {server?.members.map((member) => {
                const currentUser = member.user.id === session?.user.id;

                return (
                  <div key={member.id} className="flex items-center gap-x-2 mb-6">
                    <UserAvatar user={{ name: member.user.username, image: member.user.image || "" }} />
                    <div className="flex flex-col gap-y-1">
                      <div className="text-sm font-semibold flex items-center">
                        {member.user.username}
                        {currentUser && " (You)"}
                        <Tooltip
                          content={member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                          radius="sm"
                          showArrow={true}
                          placement="right"
                        >
                          <div>{Icons[member.role]}</div>
                        </Tooltip>
                      </div>
                    </div>
                    {loadingId !== member.id && server.ownerId !== member.userId && !currentUser && (
                      <div className="ml-auto">
                        <Tooltip content="Kick" placement="top" color="primary" showArrow={true} radius="sm">
                          <button
                            className="outline-none border-none focus:border-none focus:outline-none ring-0"
                            onClick={() => onKick(member.id)}
                          >
                            <Trash className="w-5 h-5 text-rose-500" />
                          </button>
                        </Tooltip>
                        <Dropdown placement="right" aria-label="role menu">
                          <DropdownTrigger className="outline-none border-none focus:border-none focus:outline-none ring-0">
                            <Button
                              isIconOnly
                              className="bg-inherit ml-1 outline-none border-none focus:border-none focus:outline-none ring-0"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu variant="faded" aria-label="role menu">
                            <DropdownItem
                              startContent={<ShieldAlert className="h-4 w-4" />}
                              isDisabled={member.role === "MODERATOR"}
                              onClick={() => onRoleChange(member.id, "MODERATOR")}
                            >
                              Moderator
                            </DropdownItem>
                            <DropdownItem
                              startContent={<Shield className="h-4 w-4" />}
                              isDisabled={member.role === "GUEST"}
                              onClick={() => onRoleChange(member.id, "GUEST")}
                            >
                              Guest
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    )}
                    {loadingId === member.id && <Spinner className="ml-auto" size="sm" />}
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MembersModal;
