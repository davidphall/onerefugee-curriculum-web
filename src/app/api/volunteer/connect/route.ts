import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!student) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { volunteerId } = await req.json();
  if (!volunteerId) return NextResponse.json({ error: "volunteerId required" }, { status: 400 });

  const volunteer = await prisma.user.findUnique({
    where: { id: volunteerId, role: "VOLUNTEER" },
  });
  if (!volunteer) return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });

  // Create or reactivate connection
  const connection = await prisma.mentorshipConnection.upsert({
    where: { volunteerId_studentId: { volunteerId, studentId: student.id } },
    update: { status: "ACTIVE", endedAt: null },
    create: { volunteerId, studentId: student.id, status: "ACTIVE" },
  });

  // Create DM (first message so the thread exists)
  await prisma.message.create({
    data: {
      senderId: student.id,
      recipientId: volunteerId,
      body: `Hi ${volunteer.name.split(" ")[0]}! I connected with you through the volunteer directory. Looking forward to working with you!`,
    },
  });

  // Send email to volunteer
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://onerefugee.vercel.app";
  try {
    await resend.emails.send({
      from: "One Refugee <no-reply@onerefugee.org>",
      to: volunteer.email,
      subject: `${student.name} connected with you on One Refugee`,
      html: `
        <div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">You have a new mentee!</h2>
          <p style="color: #555; margin-bottom: 24px;">
            <strong>${student.name}</strong> just connected with you through the One Refugee volunteer directory.
          </p>
          <p style="color: #555; margin-bottom: 24px;">
            You can message them and view their mentee profile in the app.
          </p>
          <a href="${appUrl}/volunteer/mentees"
            style="display: inline-block; background: #E07B39; color: #fff; text-decoration: none;
                   padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            View My Mentees
          </a>
          <p style="margin-top: 32px; font-size: 12px; color: #888;">
            One Refugee &middot; Salt Lake City, UT
          </p>
        </div>
      `,
    });
  } catch (err) {
    // Don't fail the request if email fails — just log it
    console.error("Failed to send volunteer connection email:", err);
  }

  return NextResponse.json({ connection });
}
