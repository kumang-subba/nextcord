import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface pageProps {
  params: {
    serverId: string;
  };
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/sign-in");
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: session?.user.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];
  if (initialChannel?.name !== "general") {
    return null;
  }
  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default page;
