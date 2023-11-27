import { Hash } from "lucide-react";
import Image from "next/image";
import UserAvatar from "../UserAvatar";

type ChatWelcomeProps = {
  name: string;
  type: "channel" | "chat";
  imageUrl?: string;
};

export const ChatWelcome = ({ name, type, imageUrl }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" ? (
        <div
          className="h-[75px] w-[75px] rounded-full bg-zinc-700
            flex items-center justify-center"
        >
          <Hash className="h-12 w-12 text-white" />
        </div>
      ) : (
        <UserAvatar user={{ name: name, image: imageUrl }} className="h-16 w-16" />
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-zinc-400 text-sm">
        {type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your chat with ${name}.`}
      </p>
    </div>
  );
};
