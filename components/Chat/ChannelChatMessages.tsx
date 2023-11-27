"use client";
import { ElementRef, Fragment, useEffect, useRef, useState } from "react";
import { useSocket } from "../Providers/SocketProvider";
import { DirectMessage, Member, Message, User } from "@prisma/client";
import { ChatWelcome } from "./ChatWelcome";
import { format } from "date-fns";
import { ChatItem } from "./ChatItem";

interface ChannelChatMessagesProps {
  name: string;
  currentUser: User;
  channelId: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  imageUrl?: string;
  currentMember: Member;
  initialMessages: MessageWithMemberAndUser[];
}

type MessageWithMemberAndUser = Message & {
  member: Member & {
    user: User;
  };
};
const ChannelChatMessages = ({
  name,
  currentUser,
  channelId,
  socketUrl,
  socketQuery,
  imageUrl,
  currentMember,
  initialMessages,
}: ChannelChatMessagesProps) => {
  const { socket } = useSocket();
  const addKey = `chat:${channelId}:messages`;
  const updateKey = `chat:${channelId}:messages:update`;
  const [messages, setMessages] = useState<MessageWithMemberAndUser[]>(initialMessages);
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(addKey, (newMessage: MessageWithMemberAndUser) => {
      setMessages((prev) => [newMessage, ...prev]);
    });
    socket.on(updateKey, (updatedMessage: MessageWithMemberAndUser) => {
      setMessages((prev) => {
        return prev.map((message) => {
          if (message.id === updatedMessage.id) {
            return updatedMessage;
          }
          return message;
        });
      });
    });
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, addKey, updateKey]);

  return (
    <div id="messages" ref={chatRef} className="flex flex-1 flex-col-reverse py-4 overflow-y-auto">
      {Array.from(messages).map((message: MessageWithMemberAndUser, index) => {
        const hasNextMessageFromSameUser = messages[index + 1]?.member.userId === messages[index].member.userId;

        return (
          <ChatItem
            key={message.id}
            user={message.member.user}
            messageId={message.id}
            content={message.content}
            timestamp={format(new Date(message.createdAt), "d MMM yyyy, HH:mmaaa")}
            time={format(new Date(message.createdAt), "HH:mmaaa")}
            imageUrl={message.fileUrl}
            deleted={message.deleted}
            isUpdated={message.edited}
            currentUser={currentUser}
            currentMember={currentMember}
            hasNextMessageFromSameUser={hasNextMessageFromSameUser}
            socketUrl={socketUrl}
            socketQuery={socketQuery}
          />
        );
      })}
      <ChatWelcome type="channel" name={name} imageUrl={imageUrl} />
      <div ref={bottomRef} />
    </div>
  );
};

export default ChannelChatMessages;
