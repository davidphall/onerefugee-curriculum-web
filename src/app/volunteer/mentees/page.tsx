import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function MenteesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "VOLUNTEER") redirect("/dashboard");

  const connections = await prisma.mentorshipConnection.findMany({
    where: { volunteerId: user.id, status: "ACTIVE" },
    include: {
      student: {
        include: { studentProfile: true },
      },
      notes: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { connectedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">My Mentees</h1>
        <p className="text-muted-foreground mt-1">
          {connections.length} active mentorship{connections.length !== 1 ? "s" : ""}
        </p>
      </div>

      {connections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <Users className="h-10 w-10 text-muted-foreground/30" />
            <p className="font-medium">No mentees yet</p>
            <p className="text-sm text-muted-foreground">
              Students will appear here once they connect with you from the volunteer directory.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((conn) => (
            <Link key={conn.id} href={`/volunteer/mentees/${conn.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#E07B39]/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-[#E07B39]">
                        {conn.student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{conn.student.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{conn.student.email}</p>
                      {conn.student.studentProfile?.university && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {conn.student.studentProfile.university}
                        </p>
                      )}
                    </div>
                  </div>
                  {conn.notes[0] && (
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 border-t pt-2">
                      {conn.notes[0].body}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Connected {new Date(conn.connectedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
