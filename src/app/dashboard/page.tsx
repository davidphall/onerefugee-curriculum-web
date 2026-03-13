import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/onboarding");

  switch (user.role) {
    case "ADMIN":
      redirect("/admin");
    case "STAFF":
      redirect("/staff");
    case "VOLUNTEER":
      redirect("/volunteer");
    case "STUDENT":
    default:
      redirect("/student");
  }
}
