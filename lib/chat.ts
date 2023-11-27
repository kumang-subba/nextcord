import { db } from "./db";

export const getOrCreateChat = async (UserOneId: string, UserTwoId: string) => {
  let chat = (await findChat(UserOneId, UserTwoId)) || (await findChat(UserTwoId, UserOneId));
  if (!chat) {
    chat = await createNewChat(UserOneId, UserTwoId);
  }

  return chat;
};

const findChat = async (UserOneId: string, UserTwoId: string) => {
  try {
    return await db.chat.findFirst({
      where: {
        AND: [{ userOneId: UserOneId }, { userTwoId: UserTwoId }],
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    });
  } catch {
    return null;
  }
};

const createNewChat = async (UserOneId: string, UserTwoId: string) => {
  try {
    return await db.chat.create({
      data: {
        userOneId: UserOneId,
        userTwoId: UserTwoId,
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    });
  } catch {
    return null;
  }
};
