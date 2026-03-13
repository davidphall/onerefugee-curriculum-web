import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const staff = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!staff || staff.role === "STUDENT")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { studentId, notes, flagged } = await req.json();
  if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const log = await prisma.wellnessLog.create({
    data: { studentId, staffId: staff.id, notes, flagged: flagged ?? false },
  });

  return NextResponse.json(log);
}
