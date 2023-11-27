import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./Navigation/NavigationSidebar";
import ServerSidebar from "./Server/ServerSidebar";
import DashboardSidebar from "./Dashboard/DashboardSidebar";

type MobileToggleProps =
  | {
      type: "server";
      serverId: string;
    }
  | {
      type: "dashboard";
      serverId: undefined;
    };

export const MobileToggle = ({ serverId, type }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        {type === "server" && <ServerSidebar serverId={serverId} />}
        {type === "dashboard" && <DashboardSidebar />}
      </SheetContent>
    </Sheet>
  );
};
