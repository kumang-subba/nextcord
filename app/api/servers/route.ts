import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ServerCreateChangeValidator } from "@/lib/validators/server";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name, imageUrl } = ServerCreateChangeValidator.parse(body);

    const server = await db.server.create({
      data: {
        ownerId: session.user.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", userId: session.user.id }],
        },
        members: {
          create: [{ userId: session.user.id, role: MemberRole.ADMIN }],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new NextResponse("Server Error, please try again later", { status: 500 });
  }
}
