import { getAuthSessionPages } from "@/lib/auth-pages";
import { db } from "@/lib/db";
import { AddFriendValidator } from "@/lib/validators/addFriend";
import { NextApiResponseServerIo } from "@/types/server";
import { NextApiRequest } from "next";
import { z } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const session = await getAuthSessionPages(req, res);

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = req.body;
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
      return res.status(400).json({ error: "Invalid username" });
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
      return res.status(409).json({ error: "Request already exists" });
    }

    const newFriendRequest = await db.friends.create({
      data: {
        userId: session.user.id,
        friendId: addedFriend.id,
      },
    });

    const userKey = `user:${addedFriend.id}:incoming_request`;

    res?.socket?.server?.io?.emit(userKey, newFriendRequest);

    return res.status(200).json("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: "Invalid data passed" });
    }
    return res.status(500).json({ error: "Could not add user at this time. Please try again later" });
  }
}
