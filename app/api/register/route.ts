import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { UserCreationValidator, UserSettingsValidator } from "@/lib/validators/user";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, confirmPassword } = UserCreationValidator.parse(body);
    if (!username || !password || !confirmPassword) {
      return new NextResponse("Missing fields", { status: 400 });
    }
    if (password !== confirmPassword) {
      return new NextResponse("Passwords do not match", { status: 400 });
    }

    const userExists = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (userExists) {
      return new NextResponse("Username already exists", { status: 409 });
    }
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const user = await db.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Unprocessable Entity
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not create comment, please try again later.", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    const body = await req.json();

    const { username, imageUrl } = UserSettingsValidator.parse(body);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userMatch = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!userMatch) {
      return new Response("Unauthorized", { status: 401 });
    }

    const usernameExists = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (usernameExists) {
      return new Response("Username already exists", { status: 409 });
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
        image: imageUrl,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Unprocessable Entity
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not change user settings, please try again later.", { status: 500 });
  }
}
