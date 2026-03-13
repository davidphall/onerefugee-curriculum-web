import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Heart } from "lucide-react";

export default async function WellnessPage() {
  const user = await getCurrentUser();
  if (!user || user.role === "STUDENT") redirect("/student");

  const assignments = await prisma.staffAssignment.findMany({
    where: { staffId: user.id },
    include: {
      student: {
        include: {
          wellnessLogs: {
            orderBy: { date: "desc" },
            take: 5,
            include: { staff: { select: { name: true } } },
          },
        },
      },
    },
  });

  const flagged = assignments.filter(
    (a) => a.student.wellnessLogs[0]?.flagged
  );
  const allLogs = assignments
    .flatMap((a) =>
      a.student.wellnessLogs.map((log) => ({ ...log, student: a.student }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Wellness</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your students&apos; wellbeing.
        </p>
      </div>

      {/* Flagged students */}
      {flagged.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" /> Flagged Students ({flagged.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {flagged.map(({ student }) => (
              <Link
                key={student.id}
                href={`/staff/students/${student.id}`}
                className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.wellnessLogs[0]?.notes?.slice(0, 60) ?? "No notes"}
                      {(student.wellnessLogs[0]?.notes?.length ?? 0) > 60 ? "…" : ""}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                  Flagged
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent logs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#E07B39]" /> Recent Wellness Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No wellness logs yet.</p>
          ) : (
            allLogs.map((log, i) => (
              <div key={log.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <Link
                      href={`/staff/students/${log.student.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {log.student.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.date).toLocaleDateString()} · Logged by {log.staff.name}
                    </p>
                    {log.notes && <p className="text-sm mt-1">{log.notes}</p>}
                  </div>
                  {log.flagged && (
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200 shrink-0">
                      Flagged
                    </Badge>
                  )}
                </div>
                {i < allLogs.length - 1 && <Separator className="mt-4" />}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
