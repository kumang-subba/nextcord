import ChannelChatMessages from "@/components/Chat/ChannelChatMessages";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInput from "@/components/Chat/ChatInput";
import ChatMessages from "@/components/Chat/ChatMessages";
import { MediaRoom } from "@/components/MediaRoom";
import { getAuthSession } from "@/lib/auth";
import { getOrCreateChat } from "@/lib/chat";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface pageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const currentUser = await db.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser) {
    return redirect("/sign-in");
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
    },
  });

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: session.user.id,
    },
  });

  if (!channel || !currentMember) {
    redirect("/");
  }

  const messages = await db.message.findMany({
    where: {
      channelId: channel.id,
    },
    include: {
      member: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex flex-col h-screen bg-[#393b3e]">
      <ChatHeader name={channel.name!} type="server" serverId={channel.serverId} />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChannelChatMessages
            currentUser={currentUser}
            name={channel.name!}
            channelId={channel.id}
            socketUrl="/api/socket/channelMessages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            currentMember={currentMember}
            imageUrl={server?.imageUrl}
            initialMessages={messages}
          />
          <ChatInput
            chatTarget={`#${channel.name}`}
            endpoint="/api/socket/channelMessages"
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && <MediaRoom chatId={channel.id} video={false} audio={true} />}
      {channel.type === ChannelType.VIDEO && <MediaRoom chatId={channel.id} video={true} audio={true} />}
    </div>
  );
};

export default page;
