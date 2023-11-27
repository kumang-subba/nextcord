import { MobileToggle } from "../MobileToggle";
import UserAvatar from "../UserAvatar";
import { ChatAudioButton } from "./ChatAudioButton";
import { ChatVideoButton } from "./ChatVideoButton";

interface ChatHeaderBase {
  name: string;
  imageUrl?: string;
}
type ConditionalProps =
  | {
      type: "server";
      serverId: string;
    }
  | {
      type: "dashboard";
      serverId: undefined;
    };

type ChatHeaderProps = ChatHeaderBase & ConditionalProps;

const ChatHeader = ({ name, type, imageUrl, serverId }: ChatHeaderProps) => {
  return (
    <div className="text-base font-semibold p-4 flex items-center h-14 border-neutral-800 border-b-2">
      {type === "server" && <MobileToggle type={type} serverId={serverId} />}
      {type === "dashboard" && <MobileToggle type={type} serverId={undefined} />}
      <p className="font-semibold text-base text-white ml-2">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "dashboard" && (
          <>
            <ChatAudioButton /> <ChatVideoButton />
          </>
        )}{" "}
      </div>
    </div>
  );
};

export default ChatHeader;
