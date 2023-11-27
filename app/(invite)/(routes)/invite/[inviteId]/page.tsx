import InviteActions from "@/components/InviteActions";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";

interface pageProps {
  params: {
    inviteId: string;
  };
}

const page = async ({ params: { inviteId } }: pageProps) => {
  const session = await getAuthSession();
  if (!inviteId) {
    return redirect("/");
  }
  const alreadyMemberInServer = await db.server.findFirst({
    where: {
      inviteCode: inviteId,
      members: {
        some: {
          userId: session?.user.id,
        },
      },
    },
  });

  if (alreadyMemberInServer) {
    return redirect(`/servers/${alreadyMemberInServer.id}`);
  }

  const server = await db.server.findUnique({
    where: {
      inviteCode: inviteId,
    },
  });
  if (!server) {
    return redirect("/");
  }

  return (
    <div className="container max-w-lg min-w-[500px] mx-auto rounded-lg bg-slate-600 py-4 space-y-4 flex flex-col items-center justify-center">
      <div className="flex justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Join server <span className="font-semibold text-indigo-400">{server?.name}</span>?
        </h1>
      </div>
      <div className="relative flex mx-3 h-52 w-52 rounded-[24px] overflow-hidden">
        <Image src={server?.imageUrl} alt={`server ${server.name}`} fill sizes="100%" />
      </div>
      <InviteActions inviteId={inviteId} />
    </div>
  );
};

export default page;
