import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  const hasFriends = await db.friends.findFirst({
    where: {
      userId: session.user.id,
      requestAccepted: true,
    },
  });

  if (hasFriends) {
    redirect("/dashboard/friends");
  } else {
    redirect("/dashboard/add");
  }
};

export default Page;
