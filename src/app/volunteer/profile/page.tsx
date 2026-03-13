import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function VolunteerProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "VOLUNTEER") redirect("/dashboard");

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Students browse volunteer profiles to find a mentor. Keep yours up to date.
        </p>
      </div>
      <ProfileForm
        initialBio={profile?.bio ?? ""}
        initialSkills={profile?.skills ?? []}
        initialAvailability={profile?.availability ?? ""}
        initialLinkedinUrl={profile?.linkedinUrl ?? ""}
      />
    </div>
  );
}
