import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Tooltip } from "@nextui-org/react";
import { ChannelType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import SignOut from "../SignOut";
import UserAvatar from "../UserAvatar";
import UserSettings from "../UserSettings";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import ServerHeader from "./ServerHeader";
import ServerChannel from "./ServerChannel";

interface ServerSidebarProps {
  serverId: string;
}
const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const session = await getAuthSession();
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) return notFound();
  if (!session) return redirect("/sign-in");

  const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const role = server?.members.find((member) => member.userId === session?.user.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full bg-[#2B2D31] gap-y-2">
      <ServerHeader server={server} role={role} session={session} />
      <ScrollArea className="flex-1 px-2">
        <Separator className="bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      {/* //* User settings */}
      <div className="mt-auto bg-stone-800/40 px-2 border-l-1 border-zinc-700 flex items-center max-w-full">
        <Tooltip
          content={session?.user.username}
          placement="top-start"
          color="primary"
          showArrow={true}
          radius="sm"
          className="font-medium text-lg p-4"
        >
          <div className="flex items-center gap-x-4 py-3 text-sm font-semibold flex-1 overflow-hidden">
            <UserAvatar
              user={{ name: session?.user.username, image: session?.user.image || "" }}
              className="text-lg w-10 h-10"
            />
            <p className="text-base -ml-2 truncate">{session?.user.username}</p>
          </div>
        </Tooltip>
        <div className="flex">
          <UserSettings session={session!} />
          <SignOut />
        </div>
      </div>
    </div>
  );
};

export default ServerSidebar;
