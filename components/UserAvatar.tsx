"use client";
import { User } from "next-auth";
import { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user?.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image fill src={user.image} alt="profile picture" referrerPolicy="no-referrer" className="rounded-full" />
        </div>
      ) : (
        <AvatarFallback className="bg-slate-600">
          <span>{user?.name?.slice(0, 2).toUpperCase()}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
