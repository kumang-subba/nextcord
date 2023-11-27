import { useId } from "react";
import { getAuthSessionPages } from "@/lib/auth-pages";
import { db } from "@/lib/db";
import { ChatValidator } from "@/lib/validators/chat";
import { NextApiResponseServerIo } from "@/types/server";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const session = await getAuthSessionPages(req, res);
    const { content } = req.body;
    const { chatId, directMessageId } = req.query;

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!chatId) {
      return res.status(400).json({ error: "Chat ID missing" });
    }
    if (!directMessageId) {
      return res.status(400).json({ error: "Message ID missing" });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        chatId: chatId as string,
      },
      include: {
        user: true,
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isOwner = directMessage.userId === session.user.id;

    if (!isOwner) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          deleted: true,
          content: "This message has been deleted",
        },
        include: {
          user: true,
        },
      });
    }

    if (req.method === "PATCH") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
          edited: true,
        },
        include: {
          user: true,
        },
      });
    }

    const updateKey = `chat:${chatId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("Chat post", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
