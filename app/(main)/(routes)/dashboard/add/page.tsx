import AddFriend from "@/components/AddFriend";
import { MobileToggle } from "@/components/MobileToggle";
import { UserPlus } from "lucide-react";

const Page = () => {
  return (
    <div className="flex flex-col h-screen bg-[#393b3e]">
      <div className="text-base font-semibold p-4 flex items-center h-14 border-neutral-800 border-b-2">
        <MobileToggle type="dashboard" serverId={undefined} />
        <UserPlus className="mr-2" />
        <p className="font-semibold text-base">Add Friend</p>
      </div>
      <p className="text-sm px-5 pt-8">You can add friends with their NextCord username</p>
      <AddFriend />
    </div>
  );
};

export default Page;
