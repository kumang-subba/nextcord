import { getAuthSession } from "@/lib/auth";
import SignOut from "../SignOut";
import UserAvatar from "../UserAvatar";
import UserSettings from "../UserSettings";
import DashBoardAddFriend from "./DashBoardAddFriend";
import DashBoardFriends from "./DashBoardFriends";
import DashBoardFriendRequests from "./DashBoardFriendRequests";
import { db } from "@/lib/db";
import { Tooltip } from "@nextui-org/react";
import { Separator } from "../ui/separator";
import DashBoardFriend from "./DashBoardFriend";
import { ScrollArea } from "../ui/scroll-area";
import { redirect } from "next/navigation";

const DashboardSidebar = async () => {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/sign-in");
  }

  const unseenRequests = await db.friends.count({
    where: {
      friendId: session?.user.id,
      requestSeen: false,
    },
  });

  const directMessages = await db.chat.findMany({
    where: {
      OR: [
        { userOneId: session?.user.id },
        {
          userTwoId: session?.user.id,
        },
      ],
    },
    include: {
      userOne: true,
      userTwo: true,
    },
  });
  return (
    <div className="flex flex-col h-full text-primary w-full bg-[#2B2D31]">
      <DashBoardAddFriend />
      <DashBoardFriends />
      <DashBoardFriendRequests unseenRequestCount={unseenRequests} userId={session?.user.id} />

      {!!directMessages?.length && (
        <>
          <Separator className="h-[2px] bg-zinc-700 rounded-md w-full" />
          <p className="text-center text-zinc-400 font-semibold">Direct Messages</p>
          <ScrollArea className="flex-1 px-2">
            {directMessages.map((chat) => {
              const isFriend = chat.userOneId === session?.user.id ? chat.userTwo : chat.userOne;
              return <DashBoardFriend friend={isFriend} key={chat.id} />;
            })}
          </ScrollArea>
        </>
      )}

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

export default DashboardSidebar;
