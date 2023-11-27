import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.friends.updateMany({
      where: {
        friendId: session.user.id,
        requestSeen: false,
      },
      data: {
        requestSeen: true,
      },
    });
    return new Response("OK");
  } catch (error) {
    return new Response("Could not process action. Please try again", { status: 500 });
  }
}
