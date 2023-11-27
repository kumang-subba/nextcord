"use client";

import { Button } from "@nextui-org/react";
import { useState } from "react";
import { Icons } from "./Icons";
import { signIn } from "next-auth/react";

interface LoginWithGoogleProps {}

const LoginWithGoogle = ({}: LoginWithGoogleProps) => {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[400px]">
      <div className="flex flex-col px-6">
        <Button isLoading={loading} onClick={login}>
          {loading ? null : <Icons.google className="h-4 w-4 mr-2" />}
          Google
        </Button>
      </div>
    </div>
  );
};

export default LoginWithGoogle;
