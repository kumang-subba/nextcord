import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function PATCH(req: Request, { params }: { params: { friendsId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const requestExists = await db.friends.findFirst({
      where: {
        id: params.friendsId,
        friendId: session.user.id,
      },
    });

    if (!requestExists) {
      return new Response("Friend request does not exist", { status: 400 });
    }

    await db.friends.updateMany({
      where: {
        id: params.friendsId,
      },
      data: {
        requestSeen: true,
        requestAccepted: true,
      },
    });
    return new Response("OK");
  } catch (error) {
    return new Response("Could not process action. Please try again", { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: { friendsId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    await db.friends.delete({
      where: {
        id: params.friendsId,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Unprocessable Entity
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Server error, please try again later.", { status: 500 });
  }
}
