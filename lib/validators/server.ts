import { z } from "zod";

export const ServerCreateChangeValidator = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});

export type ServerCreateChangeRequest = z.infer<typeof ServerCreateChangeValidator>;
