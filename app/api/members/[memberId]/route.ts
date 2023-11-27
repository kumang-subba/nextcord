import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }

    const userInServer = await db.member.findFirst({
      where: {
        serverId: serverId,
        userId: session.user.id,
      },
    });
    const canModify = userInServer?.role === "ADMIN" || userInServer?.role === "MODERATOR";
    if (!canModify) {
      return new NextResponse("Permission invalid", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            userId: {
              not: session.user.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (err) {
    return new Response("Could not kick user at this time. Please try again later", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              userId: {
                not: session.user.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (err) {
    return new Response("Could not change role at this time. Please try again later", { status: 500 });
  }
}
