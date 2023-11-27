import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="z-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
