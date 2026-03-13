import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ConversationView } from "./conversation-view";

export default async function DMPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: recipientId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!recipient) notFound();

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: user.id, recipientId },
        { senderId: recipientId, recipientId: user.id },
      ],
    },
    orderBy: { sentAt: "asc" },
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: { senderId: recipientId, recipientId: user.id, read: false },
    data: { read: true, readAt: new Date() },
  });

  return (
    <ConversationView
      currentUserId={user.id}
      recipient={recipient}
      initialMessages={messages.map((m) => ({
        id: m.id,
        body: m.body,
        sentAt: m.sentAt.toISOString(),
        senderId: m.senderId,
        senderName: m.sender.name,
      }))}
    />
  );
}
