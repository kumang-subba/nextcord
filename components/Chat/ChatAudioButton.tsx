"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Phone, PhoneOff } from "lucide-react";
import { ActionTooltip } from "../ActionTooltip";

export const ChatAudioButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isAudio = searchParams?.get("audio");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          audio: isAudio ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  const Icon = isAudio ? PhoneOff : Phone;
  const tooltipLabel = isAudio ? "End audio call" : "Start audio call";
  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
