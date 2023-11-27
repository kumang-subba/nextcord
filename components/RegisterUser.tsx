"use client";
import axios, { AxiosError } from "axios";

import { Button, Input } from "@nextui-org/react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { UserCreationRequest, UserCreationValidator } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Check, EyeIcon, EyeOffIcon, Lock, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const RegisterUser = () => {
  const form = useForm({
    resolver: zodResolver(UserCreationValidator),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const registerUser = async (data: UserCreationRequest) => {
    try {
      const response = await axios.post("/api/register", data);
      if (response.status === 200) {
        await signIn("credentials", {
          username: data.username,
          password: data.password,
          redirect: false,
        });
      }

      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409)
          toast.error("Username already exists", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
      }
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  return (
    <div className="min-w-[400px]">
      {" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(registerUser)} className="space-y-4">
          <div className="space-y-6 px-6 flex flex-col">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Input
                    autoFocus
                    endContent={<User className="text-2xl pointer-events-none flex-shrink-0" />}
                    label="Username"
                    placeholder="Enter your username"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Input
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeIcon className="text-2xl pointer-events-none" />
                        ) : (
                          <EyeOffIcon className="text-2xl pointer-events-none" />
                        )}
                      </button>
                    }
                    label="Password"
                    placeholder="Enter your password"
                    {...field}
                    type={isVisible ? "text" : "password"}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Input
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
                        {isConfirmVisible ? (
                          <EyeIcon className="text-2xl pointer-events-none" />
                        ) : (
                          <EyeOffIcon className="text-2xl pointer-events-none" />
                        )}
                      </button>
                    }
                    label="Confirm-password"
                    placeholder="Enter your password again"
                    {...field}
                    type={isConfirmVisible ? "text" : "password"}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              color="secondary"
              className="bg-white text-gray-800 font-semibold hover:bg-green-600 hover:text-white"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Register
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterUser;
