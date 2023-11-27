import { getAuthSessionPages } from "@/lib/auth-pages";
import { db } from "@/lib/db";
import { ChatValidator } from "@/lib/validators/chat";
import { NextApiResponseServerIo } from "@/types/server";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const session = await getAuthSessionPages(req, res);
    const body = req.body;
    const { chatId } = req.query;

    const { content, image } = ChatValidator.parse(body);

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!chatId) {
      return res.status(400).json({ error: "Chat ID missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "Content Missing" });
    }

    const chat = await db.chat.findFirst({
      where: {
        id: chatId as string,
        OR: [
          {
            userOneId: session.user.id,
          },
          {
            userTwoId: session.user.id,
          },
        ],
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const loggedInUser = chat.userOneId === session.user.id ? chat.userOne : chat.userTwo;

    if (!loggedInUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const newMessage = await db.directMessage.create({
      data: {
        content,
        fileUrl: image,
        chatId: chatId as string,
        userId: loggedInUser.id,
      },
      include: {
        user: true,
      },
    });

    const channelKey = `chat:${chatId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, newMessage);

    return res.status(200).json(newMessage);
  } catch (error) {
    console.log("Chat post", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
