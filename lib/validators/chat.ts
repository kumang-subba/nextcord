import { z } from "zod";

export const ChatValidator = z.object({
  content: z.string().min(1, "Content is required"),
  image: z.string().optional().nullable(),
});

export type ChatRequest = z.infer<typeof ChatValidator>;
