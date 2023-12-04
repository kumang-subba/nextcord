import Friends from "@/components/Friends";
import { MobileToggle } from "@/components/MobileToggle";
import { Users } from "lucide-react";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="flex flex-col h-screen bg-[#393b3e]">
      <div className="text-base font-semibold p-4 flex items-center h-14 border-neutral-800 border-b-2">
        <MobileToggle type="dashboard" serverId={undefined} />

        <Users className="mr-2" />
        <p className="font-semibold text-base">Your Friends</p>
      </div>
      <Friends />
    </div>
  );
};

export default Page;
