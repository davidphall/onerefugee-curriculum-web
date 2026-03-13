import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId") ?? currentUser.id;

  if (currentUser.role === "STUDENT" && studentId !== currentUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const applications = await prisma.jobApplication.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { studentId, company, jobTitle, dateApplied, stage, notes, url } = await req.json();
  const targetStudentId = studentId ?? currentUser.id;

  if (currentUser.role === "STUDENT" && targetStudentId !== currentUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const application = await prisma.jobApplication.create({
    data: {
      studentId: targetStudentId,
      company,
      jobTitle,
      dateApplied: dateApplied ? new Date(dateApplied) : null,
      stage: stage ?? "APPLIED",
      notes,
      url,
    },
  });

  return NextResponse.json(application);
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id, company, jobTitle, dateApplied, stage, notes, url } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const existing = await prisma.jobApplication.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (currentUser.role === "STUDENT" && existing.studentId !== currentUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const application = await prisma.jobApplication.update({
    where: { id },
    data: {
      ...(company !== undefined && { company }),
      ...(jobTitle !== undefined && { jobTitle }),
      ...(dateApplied !== undefined && { dateApplied: dateApplied ? new Date(dateApplied) : null }),
      ...(stage !== undefined && { stage }),
      ...(notes !== undefined && { notes }),
      ...(url !== undefined && { url }),
    },
  });

  return NextResponse.json(application);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const existing = await prisma.jobApplication.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (currentUser.role === "STUDENT" && existing.studentId !== currentUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.jobApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
