"use client";

import { Tooltip } from "@nextui-org/react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const SignOut = () => {
  return (
    <Tooltip content="Sign out" placement="top" color="primary" showArrow={true} radius="sm">
      <button
        className="flex items-center relative outline-none border-none focus:border-none focus:outline-none ring-0 px-2"
        onClick={() => signOut()}
      >
        <LogOut />
      </button>
    </Tooltip>
  );
};

export default SignOut;
