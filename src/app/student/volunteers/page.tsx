import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { HandHeart, Linkedin } from "lucide-react";
import Link from "next/link";

export default async function VolunteerDirectoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const volunteers = await prisma.user.findMany({
    where: { role: "VOLUNTEER", volunteerProfile: { isNot: null } },
    include: {
      volunteerProfile: true,
      mentorships: {
        where: { studentId: user.id, status: "ACTIVE" },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Volunteer Mentors</h1>
        <p className="text-muted-foreground mt-1">
          Connect with a volunteer mentor who can support your journey.
        </p>
      </div>

      {volunteers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <HandHeart className="h-10 w-10 text-muted-foreground/30" />
            <p className="font-medium">No volunteers yet</p>
            <p className="text-sm text-muted-foreground">Check back soon — volunteers are joining!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((v) => {
            const connected = v.mentorships.length > 0;
            return (
              <Link key={v.id} href={`/student/volunteers/${v.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-full bg-[#E07B39]/10 flex items-center justify-center shrink-0">
                        <span className="text-base font-bold text-[#E07B39]">
                          {v.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{v.name}</p>
                          {v.volunteerProfile?.linkedinUrl && (
                            <a
                              href={v.volunteerProfile.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                            </a>
                          )}
                        </div>
                        {v.volunteerProfile?.availability && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {v.volunteerProfile.availability}
                          </p>
                        )}
                      </div>
                    </div>

                    {v.volunteerProfile?.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {v.volunteerProfile.bio}
                      </p>
                    )}

                    {v.volunteerProfile?.skills && v.volunteerProfile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {v.volunteerProfile.skills.slice(0, 4).map((s) => (
                          <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                        {v.volunteerProfile.skills.length > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{v.volunteerProfile.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {connected && (
                      <span className="inline-block text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                        Connected
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
