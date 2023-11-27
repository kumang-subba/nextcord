"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useModal } from "@/hooks/useModal";
import { UserSettingsRequest, UserSettingsValidator } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FileUpload } from "../FileUpload";

const UserSettingsModal = () => {
  const {
    isOpen,
    onClose,
    type,
    data: { session },
  } = useModal();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserSettingsValidator),
    defaultValues: {
      username: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (session) {
      form.setValue("username", session.user.username || "");
      form.setValue("imageUrl", session.user.image || "");
    }
  }, [form, session]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: UserSettingsRequest) => {
    try {
      const response = await axios.patch("/api/register", values);
      if (response.status === 200) {
        toast.success("Updated successfully", {
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
      console.log(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast.error("Username already exists", {
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
    }
  };

  const isModalOpen = isOpen && type === "userSettings";
  return (
    <Modal isOpen={isModalOpen} onClose={onClose} className="text-foreground dark pb-4">
      <ModalContent>
        <ModalHeader>Update user settings</ModalHeader>
        <ModalBody>
          <p>Change your username and/or profile image. You can change them later.</p>
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        endContent={<Globe className="text-2xl pointer-events-none flex-shrink-0" />}
                        label="Change username"
                        placeholder="Enter your new username"
                        {...field}
                        disabled={isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    className="font-bold text-stone-100"
                    isLoading={isLoading}
                    disabled={isLoading}
                    type="submit"
                    color="success"
                  >
                    Update details
                  </Button>
                  <Button
                    className="font-bold"
                    disabled={isLoading}
                    color="danger"
                    type="button"
                    onClick={() => {
                      if (session) {
                        form.setValue("username", session.user.username || "");
                        form.setValue("imageUrl", session.user.image || "");
                      }
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserSettingsModal;
