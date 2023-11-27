import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div>
        <Image src="/bgImage.jpg" layout="fill" className="object-cover" quality={100} alt="background-image" />
      </div>
      <div className="z-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
