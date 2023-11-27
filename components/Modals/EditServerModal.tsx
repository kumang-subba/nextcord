"use client";

import { useModal } from "@/hooks/useModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FileUpload } from "../FileUpload";
import { Globe } from "lucide-react";
import { ServerCreateChangeRequest, ServerCreateChangeValidator } from "@/lib/validators/server";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect } from "react";

const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const { server } = data;

  const form = useForm({
    resolver: zodResolver(ServerCreateChangeValidator),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: ServerCreateChangeRequest) => {
    try {
      const response = await axios.patch(`/api/servers/${server?.id}`, values);
      if (response.status === 200) {
        toast.success("Server edited successfully", {
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
      toast.error("Something went wrong, please try again.", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      console.log(error);
    }
  };
  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  const isModalOpen = isOpen && type === "editServer";
  return (
    <Modal isOpen={isModalOpen} onClose={onClose} className="text-foreground dark pb-4">
      <ModalContent>
        <ModalHeader>Edit Server</ModalHeader>
        <ModalBody>
          <p>Change your server name or/and image.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        endContent={<Globe className="text-2xl pointer-events-none flex-shrink-0" />}
                        label="Server name"
                        placeholder="Enter your server name"
                        {...field}
                        disabled={isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full font-bold" isLoading={isLoading} disabled={isLoading} type="submit">
                  Update Server
                </Button>
              </div>
            </form>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditServerModal;
