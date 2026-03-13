import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import { ConnectButton } from "./connect-button";

export default async function VolunteerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const volunteer = await prisma.user.findUnique({
    where: { id, role: "VOLUNTEER" },
    include: { volunteerProfile: true },
  });

  if (!volunteer || !volunteer.volunteerProfile) notFound();

  const existingConnection = await prisma.mentorshipConnection.findUnique({
    where: { volunteerId_studentId: { volunteerId: volunteer.id, studentId: user.id } },
  });

  const isConnected = existingConnection?.status === "ACTIVE";

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-[#E07B39]/10 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-[#E07B39]">
            {volunteer.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{volunteer.name}</h1>
            {volunteer.volunteerProfile.linkedinUrl && (
              <a
                href={volunteer.volunteerProfile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
          {volunteer.volunteerProfile.availability && (
            <p className="text-muted-foreground mt-0.5">
              Available: {volunteer.volunteerProfile.availability}
            </p>
          )}
        </div>
      </div>

      {volunteer.volunteerProfile.bio && (
        <Card>
          <CardContent className="pt-5">
            <h2 className="text-sm font-semibold mb-2">About</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {volunteer.volunteerProfile.bio}
            </p>
          </CardContent>
        </Card>
      )}

      {volunteer.volunteerProfile.skills && volunteer.volunteerProfile.skills.length > 0 && (
        <Card>
          <CardContent className="pt-5">
            <h2 className="text-sm font-semibold mb-3">Skills &amp; Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {volunteer.volunteerProfile.skills.map((s) => (
                <span key={s} className="text-sm bg-muted px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ConnectButton
        volunteerId={volunteer.id}
        volunteerName={volunteer.name}
        isConnected={isConnected}
      />
    </div>
  );
}
