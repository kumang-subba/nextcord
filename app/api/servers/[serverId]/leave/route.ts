import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        ownerId: {
          not: session.user.id,
        },
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            userId: session.user.id,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("Server Error, please try again later", { status: 500 });
  }
}
