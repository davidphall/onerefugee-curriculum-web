import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Mark lesson complete (upsert — safe to call multiple times)
  await prisma.progress.upsert({
    where: { studentId_lessonId: { studentId: user.id, lessonId } },
    create: { studentId: user.id, lessonId },
    update: {},
  });

  // Award points for lesson completion
  await prisma.points.create({
    data: { studentId: user.id, amount: 10, reason: "Lesson completed" },
  });

  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await prisma.streak.findUnique({ where: { studentId: user.id } });
  if (!streak) {
    await prisma.streak.create({
      data: { studentId: user.id, currentStreak: 1, longestStreak: 1, lastActiveDate: today },
    });
  } else {
    const last = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    last?.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = last?.getTime() === today.getTime();
    const isConsecutive = last?.getTime() === yesterday.getTime();

    if (!isSameDay) {
      const newStreak = isConsecutive ? streak.currentStreak + 1 : 1;
      await prisma.streak.update({
        where: { studentId: user.id },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastActiveDate: today,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
