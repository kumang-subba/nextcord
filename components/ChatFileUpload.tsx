import { useUploadThing } from "@/lib/uploadthing";
import { Spinner } from "@nextui-org/react";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ChatFileUploadProps {
  onChange: (url?: string) => void;
  value: string | null | undefined;
}

const ChatFileUpload = ({ onChange, value }: ChatFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      onChange(res?.[0].url);
      setUploading(false);
    },
    onUploadError: () => {},
    onUploadBegin: () => {
      setUploading(true);
    },
  });
  if (value) {
    return (
      <div className="w-full rounded-md bg-zinc-700/75 p-4">
        <div className="relative h-20 w-20 bg-zinc-700/75 ml-12">
          <Image fill src={value} alt="Upload" className=" object-cover" />
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute bottom-0-0 right-0 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          className="absolute bottom-9 left-8 h-[24px] w-[24px] bg-zinc-400 
                     hover:bg-zinc-300 transition rounded-full 
                     p-1 flex items-center justify-center z-10"
          onClick={() => {
            onChange("");
          }}
        >
          <X className="text-[#313338]" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;
          startUpload(Array.from(e.target.files));
        }}
      />
      {uploading ? (
        <Spinner className="absolute bottom-9 left-8" size="sm" />
      ) : (
        <button
          type="button"
          className="absolute bottom-9 left-8 h-[24px] w-[24px] bg-zinc-400 
      hover:bg-zinc-300 transition rounded-full 
                     p-1 flex items-center justify-center z-10"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          <Plus className="text-[#313338]" />
        </button>
      )}
    </div>
  );
};

export default ChatFileUpload;
