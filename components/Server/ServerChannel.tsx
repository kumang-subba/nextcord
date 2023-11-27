"use client";

import { ModalType, useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Trash, Video, Volume2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../ActionTooltip";

interface ServerChannelProps {
  channel: Channel;
  role?: MemberRole;
  server: Server;
}
const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Volume2,
  [ChannelType.VIDEO]: Video,
};
const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal();

  const router = useRouter();

  const Icon = iconMap[channel.type];
  const params = useParams();

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700"
      )}
      onClick={onClick}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-xs   text-zinc-400 group-hover:text-zinc-300 transition",
          params?.channelId === channel.id && "text-primary text-zinc-200 group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              className="h-4 w-4 hidden group-hover:block  text-zinc-400
            hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, "editChannel")}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="h-4 w-4 hidden group-hover:block text-rose-500
            hover:text-rose-600 transition"
              onClick={(e) => onAction(e, "deleteChannel")}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "General" && <Lock className="ml-auto w-4 h-4  text-zinc-400" />}
    </button>
  );
};

export default ServerChannel;
