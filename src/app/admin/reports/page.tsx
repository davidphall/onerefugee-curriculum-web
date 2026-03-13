import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButton } from "./export-button";
import { Users, BookOpen, Trophy, TrendingUp } from "lucide-react";

export default async function ReportsPage() {
  const [
    totalStudents, totalEnrollments, totalCompletions,
    totalMilestones, milestoneCounts, courseStats,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { completedAt: { not: null } } }),
    prisma.milestone.count(),
    prisma.milestone.groupBy({ by: ["type"], _count: { type: true } }),
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const milestoneLabels: Record<string, string> = {
    INTERNSHIP: "Internships", GRADUATION: "Graduations",
    CITIZENSHIP: "Citizenships", EMPLOYMENT: "Employments", OTHER: "Other",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-muted-foreground mt-1">Impact data and exports</p>
      </div>

      {/* Impact numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ImpactCard icon={<Users className="h-5 w-5 text-blue-600" />} bg="bg-blue-50" value={totalStudents} label="Total Students" />
        <ImpactCard icon={<BookOpen className="h-5 w-5 text-[#E07B39]" />} bg="bg-[#E07B39]/10" value={totalEnrollments} label="Enrollments" />
        <ImpactCard icon={<TrendingUp className="h-5 w-5 text-green-600" />} bg="bg-green-50" value={totalCompletions} label="Completions" />
        <ImpactCard icon={<Trophy className="h-5 w-5 text-yellow-600" />} bg="bg-yellow-50" value={totalMilestones} label="Milestones" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestone breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Milestones by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestoneCounts.map((m) => (
              <div key={m.type} className="flex items-center justify-between">
                <span className="text-sm">{milestoneLabels[m.type] ?? m.type}</span>
                <span className="font-semibold">{m._count.type}</span>
              </div>
            ))}
            {milestoneCounts.length === 0 && (
              <p className="text-sm text-muted-foreground">No milestones recorded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Course enrollment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {courseStats.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-sm line-clamp-1">{c.title}</span>
                <span className="font-semibold shrink-0">{c._count.enrollments}</span>
              </div>
            ))}
            {courseStats.length === 0 && (
              <p className="text-sm text-muted-foreground">No published courses yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Export Data</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ExportCard
            title="Student Progress"
            description="All students with course completion rates and points"
            endpoint="/api/admin/export?type=progress"
            filename="student-progress"
          />
          <ExportCard
            title="Milestones"
            description="All recorded student milestones"
            endpoint="/api/admin/export?type=milestones"
            filename="milestones"
          />
          <ExportCard
            title="Enrollments"
            description="Course enrollment data for all students"
            endpoint="/api/admin/export?type=enrollments"
            filename="enrollments"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ImpactCard({ icon, bg, value, label }: {
  icon: React.ReactNode; bg: string; value: number; label: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-5">
        <div className={`p-2 rounded-md ${bg}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ExportCard({ title, description, endpoint, filename }: {
  title: string; description: string; endpoint: string; filename: string;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <ExportButton endpoint={endpoint} filename={filename} />
    </div>
  );
}
