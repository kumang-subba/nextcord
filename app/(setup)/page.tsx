import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }
};

export default Page;
