"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useModal } from "@/hooks/useModal";
import { ChannelRequest, ChannelValidator } from "@/lib/validators/channel";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { ChannelType } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";

const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();
  const { channel, server } = data;
  const form = useForm({
    resolver: zodResolver(ChannelValidator),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [form, channel]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: ChannelRequest) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      });
      const response = await axios.patch(url, values);
      if (response.status === 200) {
        toast.success("Channel edited successfully", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast.error("Channel already exists", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
        return toast.error("Something went wrong, please try again.", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
      console.log(error);
    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isModalOpen = isOpen && type === "editChannel";
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="text-white p-0 overflow-hidden bg-stone-800 border-none outline-none ring-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Create Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="dark"
                        isDisabled={isLoading}
                        placeholder="Enter channel name"
                        {...field}
                        label="Channel Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-xs p-2">Channel Type</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800/40 text-white border-0 focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4">
              <Button disabled={isLoading} className="dark" type="submit">
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
