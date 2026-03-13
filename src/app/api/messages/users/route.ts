import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Students can only message their assigned staff
  // Staff/admin can message everyone
  let users;
  if (currentUser.role === "STUDENT") {
    const assignments = await prisma.staffAssignment.findMany({
      where: { studentId: currentUser.id },
      include: { staff: { select: { id: true, name: true, email: true } } },
    });
    users = assignments.map((a) => a.staff);
  } else {
    users = await prisma.user.findMany({
      where: { id: { not: currentUser.id } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
  }

  return NextResponse.json(users);
}
