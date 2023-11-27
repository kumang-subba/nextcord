import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInput from "@/components/Chat/ChatInput";
import ChatMessages from "@/components/Chat/ChatMessages";
import { MediaRoom } from "@/components/MediaRoom";
import { getAuthSession } from "@/lib/auth";
import { getOrCreateChat } from "@/lib/chat";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface pageProps {
  params: {
    friendId: string;
  };
  searchParams: {
    audio?: boolean;
    video?: boolean;
  };
}

const page = async ({ params, searchParams }: pageProps) => {
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

  const chat = await getOrCreateChat(session.user.id, params.friendId);

  if (!chat) {
    return redirect("/dashboard");
  }

  const { userOne, userTwo } = chat;
  const otherUser = userOne.id === session.user.id ? userTwo : userOne;

  const messages = await db.directMessage.findMany({
    where: {
      chatId: chat.id,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex flex-col h-screen bg-[#393b3e]">
      <ChatHeader name={otherUser.username!} imageUrl={otherUser.image!} type="dashboard" serverId={undefined} />
      {searchParams.video && <MediaRoom chatId={chat.id} video={true} audio={true} />}
      {searchParams.audio && <MediaRoom chatId={chat.id} video={false} audio={true} />}
      {!searchParams.audio && !searchParams.video && (
        <>
          <ChatMessages
            currentUser={currentUser}
            name={otherUser.username!}
            chatId={chat.id}
            socketUrl="/api/socket/directMessage"
            socketQuery={{
              chatId: chat.id,
            }}
            imageUrl={otherUser.image || ""}
            initialMessages={messages}
          />
          <ChatInput
            chatTarget={`@${otherUser.username}`}
            endpoint="/api/socket/directMessage"
            query={{ chatId: chat.id }}
          />
        </>
      )}
    </div>
  );
};

export default page;
