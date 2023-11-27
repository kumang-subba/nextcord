"use client";
import { ElementRef, Fragment, useEffect, useRef, useState } from "react";
import { useSocket } from "../Providers/SocketProvider";
import { DirectMessage, User } from "@prisma/client";
import { ChatWelcome } from "./ChatWelcome";
import { format } from "date-fns";
import { ChatItem } from "./ChatItem";
import { useChatQuery } from "@/hooks/useChatQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/react";

interface ChatMessagesProps {
  name: string;
  currentUser: User;
  chatId: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  imageUrl?: string;
  initialMessages: (DirectMessage & {
    user: User;
  })[];
}

const ChatMessages = ({
  name,
  currentUser,
  chatId,
  socketUrl,
  socketQuery,
  imageUrl,
  initialMessages,
}: ChatMessagesProps) => {
  const { socket, isConnected } = useSocket();
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const [messages, setMessages] = useState<(DirectMessage & { user: User })[]>(initialMessages);
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(addKey, (newMessage: DirectMessage & { user: User }) => {
      console.log("new Message", newMessage);
      setMessages((prev) => [newMessage, ...prev]);
    });
    socket.on(updateKey, (updatedMessage: DirectMessage & { user: User }) => {
      console.log("updatedMessage", updatedMessage);
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
  }, [socket, addKey, updateKey, queryClient, queryKey]);

  return (
    <div id="messages" ref={chatRef} className="flex flex-1 flex-col-reverse py-4 overflow-y-auto">
      {!messages && <ChatWelcome type="chat" name={name} imageUrl={imageUrl} />}
      {!isConnected && (
        <div className="flex items-center justify-center flex-col">
          <Spinner />
          <div>Loading</div>
        </div>
      )}

      {isConnected &&
        Array.from(messages).map((message, index) => {
          const hasNextMessageFromSameUser = messages[index + 1]?.userId === messages[index].userId;

          return (
            <ChatItem
              key={message.id}
              user={message.user}
              messageId={message.id}
              content={message.content}
              timestamp={format(new Date(message.createdAt), "d MMM yyyy, HH:mmaaa")}
              time={format(new Date(message.createdAt), "HH:mmaaa")}
              imageUrl={message.fileUrl}
              deleted={message.deleted}
              isUpdated={message.edited}
              currentUser={currentUser}
              hasNextMessageFromSameUser={hasNextMessageFromSameUser}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
            />
          );
        })}
      {/* {data?.pages.map((group, index) => (
        <Fragment key={index}>
          {group.items.map((message: DirectMessage & { user: User }, i: number) => {
            const hasNextMessageFromSameUser = group.items[i + 1]?.userId === group.items[i].userId;

            return (
              <ChatItem
                key={message.id}
                user={message.user}
                messageId={message.id}
                content={message.content}
                timestamp={format(new Date(message.createdAt), "d MMM yyyy, HH:mmaaa")}
                time={format(new Date(message.createdAt), "HH:mmaaa")}
                imageUrl={message.fileUrl}
                deleted={message.deleted}
                isUpdated={message.edited}
                currentUser={currentUser}
                hasNextMessageFromSameUser={hasNextMessageFromSameUser}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            );
          })}
        </Fragment>
      ))} */}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
