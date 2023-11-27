import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AddFriendValidator } from "@/lib/validators/addFriend";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { username } = AddFriendValidator.parse(body);

    const addedFriend = await db.user.findFirst({
      where: {
        username,
        NOT: {
          id: session.user.id,
        },
      },
    });
    if (!addedFriend) {
      return new Response("Invalid username", { status: 400 });
    }

    const requestExists = await db.friends.findFirst({
      where: {
        OR: [
          {
            userId: session.user.id,
            friendId: addedFriend.id,
          },
          {
            userId: addedFriend.id,
            friendId: session.user.id,
          },
        ],
      },
    });
    if (requestExists) {
      return new Response("Request already exists", { status: 409 });
    }

    await db.friends.create({
      data: {
        userId: session.user.id,
        friendId: addedFriend.id,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not add user at this time. Please try again later", { status: 500 });
  }
}
