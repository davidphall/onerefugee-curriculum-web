import { redirect } from "next/navigation";
import { syncUser } from "@/lib/auth";

export default async function OnboardingPage() {
  const user = await syncUser();

  if (!user) redirect("/sign-in");

  redirect("/dashboard");
}
