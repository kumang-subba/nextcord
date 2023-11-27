"use client";

import { cn } from "@/lib/utils";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface NavbarServerProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavbarServer = ({ id, imageUrl, name }: NavbarServerProps) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`/servers/${id}`);
  };
  return (
    <Tooltip content={name} placement="right" showArrow={true} color="primary" radius="sm">
      <button
        onClick={onClick}
        className="group relative flex items-center outline-none border-none focus:border-none focus:outline-none ring-0"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image src={imageUrl} alt={`server ${name}`} fill sizes="100%" />
        </div>
      </button>
    </Tooltip>
  );
};

export default NavbarServer;
