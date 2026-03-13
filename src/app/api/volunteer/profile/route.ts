import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "VOLUNTEER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { bio, skills, availability, linkedinUrl } = await req.json();

  const profile = await prisma.volunteerProfile.upsert({
    where: { userId: user.id },
    update: { bio, skills, availability, linkedinUrl },
    create: { userId: user.id, bio, skills, availability, linkedinUrl },
  });

  return NextResponse.json(profile);
}
