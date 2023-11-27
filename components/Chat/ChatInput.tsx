"use client";

import { ChatRequest, ChatValidator } from "@/lib/validators/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useForm } from "react-hook-form";
import ChatFileUpload from "../ChatFileUpload";
import { EmojiPicker } from "../EmojiPicker";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "@nextui-org/react";

interface ChatInputProps {
  chatTarget: string;
  endpoint: string;
  query: Record<string, any>;
}

const ChatInput = ({ chatTarget, endpoint, query }: ChatInputProps) => {
  const form = useForm<ChatRequest>({
    resolver: zodResolver(ChatValidator),
    defaultValues: {
      content: "",
      image: "",
    },
  });
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: ChatRequest) => {
    try {
      const url = qs.stringifyUrl({
        url: endpoint,
        query: query,
      });

      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative p-4 pb-6 ">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <ChatFileUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled={isLoading}
                      className="px-14 py-6 bg-zinc-700/75 
                    border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
                      placeholder={`Message ${chatTarget}`}
                      autoFocus
                      {...field}
                    />
                    <div className="absolute top-3 right-3">
                      <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)} />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default ChatInput;
