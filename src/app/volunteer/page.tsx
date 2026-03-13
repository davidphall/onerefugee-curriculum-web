import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, UserCircle } from "lucide-react";
import Link from "next/link";

export default async function VolunteerDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== "VOLUNTEER") redirect("/dashboard");

  const [profile, menteeCount] = await Promise.all([
    prisma.volunteerProfile.findUnique({ where: { userId: user.id } }),
    prisma.mentorshipConnection.count({
      where: { volunteerId: user.id, status: "ACTIVE" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-1">
          You&apos;re making a difference in refugee students&apos; lives.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#E07B39]/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-[#E07B39]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{menteeCount}</p>
                <p className="text-sm text-muted-foreground">Active Mentee{menteeCount !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/volunteer/mentees">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">My Mentees</p>
                  <p className="text-sm text-muted-foreground">View students & notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/messages">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-muted-foreground">Chat with your mentees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {!profile && (
        <Card className="border-[#E07B39]/30 bg-[#E07B39]/5">
          <CardContent className="pt-6 flex items-start gap-4">
            <UserCircle className="h-8 w-8 text-[#E07B39] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Complete your volunteer profile</p>
              <p className="text-sm text-muted-foreground mt-1">
                Students can&apos;t find you until you set up your profile. Add your skills and availability.
              </p>
              <Link
                href="/volunteer/profile"
                className="inline-block mt-3 text-sm font-medium text-[#E07B39] hover:underline"
              >
                Set up profile →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
