import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { recipientId, body } = await req.json();
  if (!recipientId || !body?.trim())
    return NextResponse.json({ error: "recipientId and body required" }, { status: 400 });

  const message = await prisma.message.create({
    data: { senderId: user.id, recipientId, body: body.trim() },
  });

  return NextResponse.json(message);
}
