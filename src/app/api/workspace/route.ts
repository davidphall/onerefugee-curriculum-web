import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/workspace?studentId=xxx  (staff/admin viewing a student)
// GET /api/workspace                (student viewing own)
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId") ?? currentUser.id;

  // Students can only view their own workspace
  if (currentUser.role === "STUDENT" && studentId !== currentUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const workspace = await prisma.scholarWorkspace.findUnique({ where: { studentId } });
  return NextResponse.json(workspace ?? { studentId });
}

// PATCH /api/workspace
export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { studentId, ...fields } = body;

  const targetStudentId = studentId ?? currentUser.id;

  // Students can only edit their own workspace
  if (currentUser.role === "STUDENT" && targetStudentId !== currentUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const workspace = await prisma.scholarWorkspace.upsert({
    where: { studentId: targetStudentId },
    update: fields,
    create: { studentId: targetStudentId, ...fields },
  });

  return NextResponse.json(workspace);
}
