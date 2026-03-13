import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Students can message their assigned staff + connected volunteers
  // Volunteers can message their mentees
  // Staff/admin can message everyone
  let users;
  if (currentUser.role === "STUDENT") {
    const [assignments, connections] = await Promise.all([
      prisma.staffAssignment.findMany({
        where: { studentId: currentUser.id },
        include: { staff: { select: { id: true, name: true, email: true } } },
      }),
      prisma.mentorshipConnection.findMany({
        where: { studentId: currentUser.id, status: "ACTIVE" },
        include: { volunteer: { select: { id: true, name: true, email: true } } },
      }),
    ]);
    const staffUsers = assignments.map((a) => a.staff);
    const volunteerUsers = connections.map((c) => c.volunteer);
    const seen = new Set<string>();
    users = [...staffUsers, ...volunteerUsers].filter((u) => {
      if (seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    });
  } else if (currentUser.role === "VOLUNTEER") {
    const connections = await prisma.mentorshipConnection.findMany({
      where: { volunteerId: currentUser.id, status: "ACTIVE" },
      include: { student: { select: { id: true, name: true, email: true } } },
    });
    users = connections.map((c) => c.student);
  } else {
    users = await prisma.user.findMany({
      where: { id: { not: currentUser.id } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
  }

  return NextResponse.json(users);
}
