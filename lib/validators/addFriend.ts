import { z } from "zod";

export const AddFriendValidator = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
});

export type AddFriendRequest = z.infer<typeof AddFriendValidator>;
