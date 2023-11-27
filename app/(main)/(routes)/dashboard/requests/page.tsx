import { MobileToggle } from "@/components/MobileToggle";
import Requests from "@/components/Requests";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserCog } from "lucide-react";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/sign-in");
  }
  const incomingRequests = await db.friends.findMany({
    where: {
      friendId: session?.user.id,
      requestAccepted: false,
    },
    include: {
      user: true,
    },
  });
  const outGoingRequests = await db.friends.findMany({
    where: {
      userId: session?.user.id,
      requestAccepted: false,
    },
    include: {
      friend: true,
    },
  });
  return (
    <div className="flex flex-col h-screen bg-[#393b3e]">
      <div className="text-base font-semibold p-4 flex items-center h-14 border-neutral-800 border-b-2">
        <MobileToggle type="dashboard" serverId={undefined} />

        <UserCog className="mr-2" />
        <p className="font-semibold text-base">Your Friend Requests</p>
      </div>
      <Requests incomingRequests={incomingRequests} outGoingRequests={outGoingRequests} />
    </div>
  );
};

export default Page;
