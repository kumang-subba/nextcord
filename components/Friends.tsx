import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Friend from "./Friend";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "@nextui-org/react";

const Friends = async () => {
  const session = await getAuthSession();
  const friends = await db.friends.findMany({
    where: {
      OR: [{ userId: session?.user.id }, { friendId: session?.user.id }],
      requestAccepted: true,
    },
    include: {
      friend: true,
      user: true,
    },
  });

  return (
    <div className="px-5 pt-8">
      <div className="flex flex-col">
        {friends.length > 0 && <p className="text-lg font-semibold">Search bar</p>}
        {friends.length > 0 ? (
          <ScrollArea className="w-full m-4 pr-4 rounded-md">
            {friends.map((friend) => {
              const isFriend = friend.userId === session?.user.id ? friend.friend : friend.user;
              return <Friend key={isFriend.id} friend={isFriend} friendshipId={friend.id} />;
            })}
          </ScrollArea>
        ) : (
          <div className="flex gap-2">
            You do not have any friends.
            <Link href={"/dashboard/add"} underline="hover" className="text-indigo-500">
              Add friends?.
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
