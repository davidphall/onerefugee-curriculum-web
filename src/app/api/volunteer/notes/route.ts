import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "VOLUNTEER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { connectionId, body } = await req.json();
  if (!connectionId || !body?.trim())
    return NextResponse.json({ error: "connectionId and body required" }, { status: 400 });

  // Verify the volunteer owns this connection
  const connection = await prisma.mentorshipConnection.findUnique({ where: { id: connectionId } });
  if (!connection || connection.volunteerId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const note = await prisma.mentorshipNote.create({
    data: { connectionId, volunteerId: user.id, body: body.trim() },
  });

  return NextResponse.json(note);
}
