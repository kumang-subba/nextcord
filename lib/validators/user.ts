import { z } from "zod";

export const UserValidator = z.object({
  username: z
    .string()
    .min(1, {
      message: "Please enter username",
    })
    .max(15, { message: "Username must be between 1 and 15 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export type UserLoginRequest = z.infer<typeof UserValidator>;

export const UserCreationValidator = z
  .object({
    username: z
      .string()
      .min(1, {
        message: "Please enter username",
      })
      .max(15, { message: "Username must be between 1 and 15 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type UserCreationRequest = z.infer<typeof UserCreationValidator>;

export const UserSettingsValidator = z.object({
  username: z
    .string()
    .min(1, {
      message: "Please enter username",
    })
    .max(15, { message: "Username must be between 1 and 15 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  imageUrl: z.string().optional().nullable(),
});

export type UserSettingsRequest = z.infer<typeof UserSettingsValidator>;
