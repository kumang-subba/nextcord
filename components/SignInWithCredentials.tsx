"use client";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UserLoginRequest, UserValidator } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SignInWithCredentials = () => {
  const form = useForm({
    resolver: zodResolver(UserValidator),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();

  const isLoading = form.formState.isSubmitting;
  const loginUser = async (data: UserLoginRequest) => {
    try {
      await signIn("credentials", {
        ...data,
        redirect: false,
      }).then((data) => {
        if (data?.ok) {
          router.push("/");
        } else {
          toast.error("Invalid credentials", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      });
    } catch (error) {
      toast.error("Invalid credentials", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="min-w-[400px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(loginUser)} className="space-y-8">
          <div className="space-y-8 px-6 flex flex-col">
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
            <Button
              type="submit"
              className="bg-white text-gray-800 font-semibold hover:bg-violet-600 hover:text-white"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInWithCredentials;
