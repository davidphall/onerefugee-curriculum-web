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

// Create course OR lesson
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  if (body.type === "lesson") {
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: body.moduleId,
        title: body.title,
        type: body.lessonType,
        content: body.content ?? null,
        videoUrl: body.videoUrl ?? null,
        order: body.order,
      },
    });
    return NextResponse.json(lesson);
  }

  // Create course
  const course = await prisma.course.create({
    data: {
      title: body.title,
      description: body.description || null,
      category: body.category,
      status: "DRAFT",
    },
  });
  return NextResponse.json(course);
}

// Update course status
export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { courseId, status } = await req.json();
  const course = await prisma.course.update({ where: { id: courseId }, data: { status } });
  return NextResponse.json(course);
}

// Add module to course
export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { courseId, title, description, order } = await req.json();
  const module = await prisma.module.create({
    data: { courseId, title, description: description || null, order },
  });
  return NextResponse.json(module);
}
