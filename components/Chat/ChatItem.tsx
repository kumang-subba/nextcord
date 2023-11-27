"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { Member, MemberRole, User } from "@prisma/client";
import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionTooltip } from "../ActionTooltip";
import UserAvatar from "../UserAvatar";

type ChatItemProps = {
  messageId: string;
  content: string;
  timestamp: string;
  imageUrl: string | null;
  deleted: boolean;
  isUpdated: boolean;
  user: User;
  time: string;
  hasNextMessageFromSameUser: boolean;
  currentUser: User;
  socketUrl: string;
  socketQuery: Record<string, string>;
  currentMember?: Member;
};

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  messageId,
  content,
  timestamp,
  imageUrl,
  deleted,
  isUpdated,
  user,
  time,
  currentUser,
  hasNextMessageFromSameUser,
  socketQuery,
  socketUrl,
  currentMember,
}: ChatItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const onUserClick = () => {
    if (user.id === currentUser.id || pathname?.split("/")[1] === "dashboard") {
      return;
    }
    router.push(`/dashboard/chat/${user.id}`);
  };
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${messageId}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isAdmin = currentMember ? currentMember.role === MemberRole.ADMIN : false;
  const isModerator = currentMember ? currentMember.role === MemberRole.MODERATOR : false;
  const isOwner = currentUser?.id === user.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);

  return (
    <div className="flex group hover:bg-black/5 p-1 transition w-full relative">
      <div className="flex pr-2 min-w-[65px]">
        {!hasNextMessageFromSameUser ? (
          <UserAvatar user={{ name: user.username, image: user.image }} className="h-14 w-14" />
        ) : (
          <div className="text-zinc-400 hidden group-hover:block mx-auto my-auto text-[10px] font-semibold">
            {time.slice(0, -2) + " " + time.slice(-2)}
          </div>
        )}
      </div>
      <div className="flex flex-col h-full justify-evenly">
        {!hasNextMessageFromSameUser && (
          <div className="flex items-center gap-x-2" onClick={onUserClick}>
            <p className="font-semibold text-base hover:underline cursor-pointer">{user.username}</p>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>
        )}
        <div>
          {imageUrl && (
            <div
              className={cn(
                "relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg bg-secondary h-48 w-48 cursor-pointer",
                deleted && "hidden"
              )}
              onClick={() => onOpen("imageModal", { imageUrl: imageUrl })}
            >
              <Image src={imageUrl} fill alt={content} className="object-cover" />
            </div>
          )}
          {isEditing ? (
            <Form {...form}>
              <form className="flex items-center w-full gap-x-2 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button isDisabled={isLoading} isLoading={isLoading} size="sm" type="submit">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">Press escape to cancel, enter to save</span>
            </Form>
          ) : (
            <p className={cn("text-sm text-zinc-300", deleted && "italic text-zinc-400 text-xs mt-1")}>
              {content}
              {isUpdated && !deleted && <span className="text-[10px] mx-2 text-zinc-400">(edited)</span>}
            </p>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {isOwner && (
            <ActionTooltip label="Edit">
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="cursor-pointer ml-auto w-4 h-4 text-rose-500 hover:text-rose-600 transition"
              onClick={() => onOpen("deleteMessage", { apiUrl: `${socketUrl}/${messageId}`, query: socketQuery })}
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
