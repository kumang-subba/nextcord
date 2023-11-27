"use client";

import { useModal } from "@/hooks/useModal";
import { Tooltip } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { Session } from "next-auth";

interface UserSettingsProps {
  session: Session;
}

const UserSettings = ({ session }: UserSettingsProps) => {
  const { onOpen } = useModal();
  return (
    <Tooltip content="User Settings" placement="top" color="primary" showArrow={true} radius="sm">
      <button
        className="group flex items-center relative outline-none border-none focus:border-none focus:outline-none ring-0 transition"
        onClick={() => onOpen("userSettings", { session })}
      >
        <Settings className="group-hover:animate-spin" />
      </button>
    </Tooltip>
  );
};

export default UserSettings;
