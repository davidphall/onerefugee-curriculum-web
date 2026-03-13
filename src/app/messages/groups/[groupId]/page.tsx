import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { GroupConversationView } from "./group-conversation-view";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const membership = await prisma.messageGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.id } },
    include: {
      group: {
        include: {
          members: { include: { user: { select: { id: true, name: true, role: true } } } },
          messages: {
            orderBy: { sentAt: "asc" },
            include: { sender: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  if (!membership) notFound();
  const { group } = membership;

  return (
    <GroupConversationView
      currentUserId={user.id}
      group={{
        id: group.id,
        name: group.name,
        description: group.description,
        members: group.members.map((m) => m.user),
      }}
      initialMessages={group.messages.map((m) => ({
        id: m.id,
        body: m.body,
        sentAt: m.sentAt.toISOString(),
        senderId: m.senderId,
        senderName: m.sender.name,
      }))}
    />
  );
}
