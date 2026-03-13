import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "./app-sidebar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar
        role={user.role as "STUDENT" | "STAFF" | "ADMIN" | "VOLUNTEER"}
        userName={user.name}
      />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
