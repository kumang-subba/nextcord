import { Icons } from "@/components/Icons";
import RegisterUser from "@/components/RegisterUser";
import Link from "next/link";

const Page = () => {
  return (
    <div className="container max-w-lg mx-auto rounded-lg bg-slate-600 py-4 space-y-4 flex flex-col items-center justify-center">
      <div className="flex justify-center items-center gap-2">
        <Icons.logo className="w-8 h-8" />
        <h1 className="text-2xl font-semibold tracking-tight">NextCord</h1>
      </div>
      <p className="text-sm max-w-xs mx-auto">Welcome to NextCord, a clone of Discord</p>
      <RegisterUser />
      <p className="px-8 text-center text-sm">
        Already have an account?{" "}
        <Link href="sign-in" className="hover:text-indigo-500 text-sm underline underline-offset-4">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Page;
