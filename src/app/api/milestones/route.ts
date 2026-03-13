import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const staff = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!staff || staff.role === "STUDENT")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { studentId, type, notes, date } = await req.json();
  if (!studentId || !type || !date)
    return NextResponse.json({ error: "studentId, type, and date required" }, { status: 400 });

  const milestone = await prisma.milestone.create({
    data: { studentId, type, notes, date: new Date(date) },
  });

  return NextResponse.json(milestone);
}
