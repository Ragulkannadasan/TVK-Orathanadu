import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "Admin") {
    redirect("/dashboard/admin");
  } else if (role === "Poruppalar") {
    redirect("/dashboard/leader");
  } else {
    redirect("/dashboard/voter");
  }

  return null;
}
