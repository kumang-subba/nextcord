import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { inviteId } = body;

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
      return new Response("Request already exists", { status: 409 });
    }

    const server = await db.server.update({
      where: {
        inviteCode: inviteId,
      },
      data: {
        members: {
          create: {
            userId: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    return new Response("Could not join server at this time. Please try again later", { status: 500 });
  }
}
