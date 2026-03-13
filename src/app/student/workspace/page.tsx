import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { WorkspaceClient } from "./workspace-client";

export default async function WorkspacePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const workspace = await prisma.scholarWorkspace.findUnique({
    where: { studentId: user.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Workspace</h1>
        <p className="text-muted-foreground mt-1">
          Your personal planning documents. Changes save automatically.
        </p>
      </div>
      <WorkspaceClient
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workspace={(workspace ?? { studentId: user.id }) as any}
      />
    </div>
  );
}
