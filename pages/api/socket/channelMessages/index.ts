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
    const { serverId, channelId } = req.query;

    const { content, image } = ChatValidator.parse(body);

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "Content Missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const loggedInMember = server.members.find((member) => member.userId === session.user.id);

    if (!loggedInMember) {
      return res.status(404).json({ message: "Member Not Found" });
    }

    const newMessage = await db.message.create({
      data: {
        content,
        fileUrl: image,
        channelId: channelId as string,
        memberId: loggedInMember.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, newMessage);

    return res.status(200).json(newMessage);
  } catch (error) {
    console.log("Chat post", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
