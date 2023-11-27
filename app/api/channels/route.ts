import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChannelValidator } from "@/lib/validators/channel";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const body = await req.json();

    const { name, type } = ChannelValidator.parse(body);
    const serverId = searchParams.get("serverId");

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new Response("Server ID Missing", { status: 400 });
    }
    if (name === "general") {
      return new Response("Name cannot be 'general'", { status: 400 });
    }

    const channelExists = await db.server.findFirst({
      where: {
        id: serverId,
        channels: {
          some: {
            AND: [{ name }, { type }],
          },
        },
      },
    });

    if (channelExists) {
      return new Response("Channel already exits", { status: 409 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: session.user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            userId: session.user.id,
            name,
            type,
          },
        },
      },
      include: {
        channels: {
          where: {
            name,
            type,
            userId: session.user.id,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not create channel at this time. Please try again later", { status: 500 });
  }
}
