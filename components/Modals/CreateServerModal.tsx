"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useModal } from "@/hooks/useModal";
import { ServerCreateChangeRequest, ServerCreateChangeValidator } from "@/lib/validators/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import axios from "axios";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FileUpload } from "../FileUpload";

const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

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
      const response = await axios.post("/api/servers", values);
      if (response.status === 200) {
        toast.success("Server created successfully", {
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

  const isModalOpen = isOpen && type === "createServer";
  return (
    <Modal isOpen={isModalOpen} onClose={onClose} className="text-foreground dark pb-4">
      <ModalContent>
        <ModalHeader>Create Server</ModalHeader>
        <ModalBody>
          <p>Give your server a name and an image. You can change them later.</p>
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
                  Create Server
                </Button>
              </div>
            </form>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateServerModal;
