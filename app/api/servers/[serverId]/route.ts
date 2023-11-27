import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ServerCreateChangeValidator } from "@/lib/validators/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const session = await getAuthSession();

    const body = await req.json();

    const { name, imageUrl } = ServerCreateChangeValidator.parse(body);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        ownerId: session.user.id,
      },
      data: {
        name,
        imageUrl,
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

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const server = await db.server.delete({
      where: {
        id: params.serverId,
        ownerId: session.user.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("Server Error, please try again later", { status: 500 });
  }
}
