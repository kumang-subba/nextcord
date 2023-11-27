import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AddServerNavbar from "./AddServerNavbar";
import DashboardNavbar from "./DashboardNavbar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavbarServer from "./NavbarServer";

const NavigationSidebar = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/sign-in");
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-stone-800 py-3">
      <DashboardNavbar />
      <Separator className="h-[2px] bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavbarServer id={server.id} name={server.name} imageUrl={server.imageUrl} />
          </div>
        ))}
        <AddServerNavbar />
      </ScrollArea>
    </div>
  );
};

export default NavigationSidebar;
