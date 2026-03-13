import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

// Update user role
export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, role } = await req.json();
  const updated = await prisma.user.update({ where: { id: userId }, data: { role } });
  return NextResponse.json(updated);
}

// Assign staff to student
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { studentId, staffId } = await req.json();
  const assignment = await prisma.staffAssignment.upsert({
    where: { staffId_studentId: { staffId, studentId } },
    create: { staffId, studentId },
    update: {},
  });
  return NextResponse.json(assignment);
}

// Remove staff assignment
export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { studentId, staffId } = await req.json();
  await prisma.staffAssignment.delete({
    where: { staffId_studentId: { staffId, studentId } },
  });
  return NextResponse.json({ success: true });
}
