"use client";
import { Friends, User } from "@prisma/client";
import Request from "./Request";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";

interface RequestsProps {
  incomingRequests?: (Friends & { user: User })[];
  outGoingRequests?: (Friends & { friend: User })[];
}

const Requests = ({ incomingRequests, outGoingRequests }: RequestsProps) => {
  const path = usePathname();
  useEffect(() => {
    const seePosts = async () => {
      await axios.patch(`/api/friends/seen`);
    };
    if (path === "/dashboard/requests") {
      seePosts();
    }
  }, [path]);
  return (
    <div className="px-5 pt-8 flex flex-col gap-5">
      <div className="flex flex-col max-h-[50%]">
        <p className="text-lg font-semibold border-b-2 border-zinc-500">Incoming Requests</p>
        {!incomingRequests?.length ? (
          <p className="text-base font-semibold py-4">No incoming requests</p>
        ) : (
          <ScrollArea className="w-full m-4 pr-4 rounded-md">
            {incomingRequests.map((request) => (
              <Request key={request.id} type="INCOMING" requestId={request.id} friend={request.user} />
            ))}
          </ScrollArea>
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-semibold border-b-2 border-zinc-500">Outgoing Requests</p>
        {!outGoingRequests?.length ? (
          <p className="text-base font-semibold py-4">No Outgoing requests</p>
        ) : (
          <ScrollArea className="w-full m-4 pr-4 rounded-md">
            {outGoingRequests.map((request) => (
              <Request key={request.id} type="OUTGOING" requestId={request.id} friend={request.friend} />
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Requests;
