import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function getUser(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } });
}

// Create group
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUser(userId);
  if (!user || user.role === "STUDENT")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, description, memberIds } = await req.json();
  if (!name || !memberIds?.length)
    return NextResponse.json({ error: "name and memberIds required" }, { status: 400 });

  const group = await prisma.messageGroup.create({
    data: {
      name,
      description: description || null,
      createdById: user.id,
      members: {
        create: [
          { userId: user.id },
          ...memberIds.map((id: string) => ({ userId: id })),
        ],
      },
    },
  });

  return NextResponse.json(group);
}

// Send group message
export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUser(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { groupId, body } = await req.json();
  if (!groupId || !body?.trim())
    return NextResponse.json({ error: "groupId and body required" }, { status: 400 });

  // Verify membership
  const member = await prisma.messageGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.id } },
  });
  if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

  const message = await prisma.groupMessage.create({
    data: { groupId, senderId: user.id, body: body.trim() },
  });

  return NextResponse.json(message);
}
