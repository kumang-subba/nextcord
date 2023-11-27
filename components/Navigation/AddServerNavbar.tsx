"use client";
import { useModal } from "@/hooks/useModal";
import { Tooltip } from "@nextui-org/react";
import { Plus } from "lucide-react";

const AddServerNavbar = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <Tooltip content="Add a Server" placement="right" color="primary" showArrow={true} radius="sm">
        <button
          className="group flex items-center outline-none border-none focus:border-none focus:outline-none ring-0"
          onClick={() => onOpen("createServer")}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-neutral-700 group-hover:bg-emerald-500">
            <Plus className="group-hover:text-white transition text-emerald-500" size={25} />
          </div>
        </button>
      </Tooltip>
    </div>
  );
};

export default AddServerNavbar;
