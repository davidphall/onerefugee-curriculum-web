import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { MessagesSidebar } from "./messages-sidebar";

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  // Load all conversations for the sidebar
  const [dms, groups] = await Promise.all([
    prisma.message.findMany({
      where: { OR: [{ senderId: user.id }, { recipientId: user.id }] },
      distinct: ["senderId", "recipientId"],
      orderBy: { sentAt: "desc" },
      include: {
        sender: { select: { id: true, name: true } },
        recipient: { select: { id: true, name: true } },
      },
    }),
    prisma.messageGroupMember.findMany({
      where: { userId: user.id },
      include: {
        group: {
          include: {
            messages: { orderBy: { sentAt: "desc" }, take: 1 },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    }),
  ]);

  // Dedupe DM conversations — one entry per other user
  const seen = new Set<string>();
  const conversations = dms
    .map((m) => {
      const other = m.senderId === user.id ? m.recipient : m.sender;
      return { id: other.id, name: other.name, lastMessage: m };
    })
    .filter(({ id }) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden rounded-lg border">
        <MessagesSidebar
          currentUserId={user.id}
          currentUserRole={user.role}
          conversations={conversations}
          groups={groups.map((gm) => ({
            id: gm.group.id,
            name: gm.group.name,
            lastMessage: gm.group.messages[0]?.body ?? null,
          }))}
        />
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {children}
        </div>
      </div>
    </AppShell>
  );
}
