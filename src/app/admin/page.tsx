import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, BookOpen, FileText, AlertTriangle,
  TrendingUp, GraduationCap, ChevronRight,
} from "lucide-react";

export default async function AdminDashboard() {
  const [
    totalStudents, totalStaff, totalCourses,
    totalEnrollments, recentMilestones, flaggedWellness,
    recentUsers, courseCompletions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "STAFF" } }),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.enrollment.count(),
    prisma.milestone.findMany({
      orderBy: { date: "desc" },
      take: 5,
      include: { student: { select: { name: true } } },
    }),
    prisma.wellnessLog.count({ where: { flagged: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.enrollment.count({ where: { completedAt: { not: null } } }),
  ]);

  const milestoneLabels: Record<string, string> = {
    INTERNSHIP: "Internship",
    GRADUATION: "Graduation",
    CITIZENSHIP: "Citizenship",
    EMPLOYMENT: "Employment",
    OTHER: "Other",
  };

  const roleColors: Record<string, string> = {
    STUDENT: "bg-blue-50 text-blue-700 border-blue-200",
    STAFF: "bg-purple-50 text-purple-700 border-purple-200",
    ADMIN: "bg-black text-white border-black",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard href="/admin/users?role=STUDENT" icon={<Users className="h-5 w-5 text-blue-600" />} bg="bg-blue-50" value={totalStudents} label="Students" />
        <StatCard href="/admin/users?role=STAFF" icon={<GraduationCap className="h-5 w-5 text-purple-600" />} bg="bg-purple-50" value={totalStaff} label="Staff" />
        <StatCard href="/admin/courses" icon={<BookOpen className="h-5 w-5 text-[#E07B39]" />} bg="bg-[#E07B39]/10" value={totalCourses} label="Published Courses" />
        <StatCard href="/admin/reports" icon={<TrendingUp className="h-5 w-5 text-green-600" />} bg="bg-green-50" value={totalEnrollments} label="Enrollments" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-md bg-green-50">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{courseCompletions}</p>
              <p className="text-sm text-muted-foreground">Course Completions</p>
            </div>
          </CardContent>
        </Card>
        <Link href="/staff/wellness">
          <Card className={`cursor-pointer hover:shadow-md transition-shadow ${flaggedWellness > 0 ? "border-red-200" : ""}`}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`p-2 rounded-md ${flaggedWellness > 0 ? "bg-red-50" : "bg-muted"}`}>
                <AlertTriangle className={`h-5 w-5 ${flaggedWellness > 0 ? "text-red-500" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold">{flaggedWellness}</p>
                <p className="text-sm text-muted-foreground">Wellness Flags</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Users</CardTitle>
              <Link href="/admin/users" className="text-xs text-[#E07B39] font-medium hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${roleColors[u.role]}`}>
                  {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent milestones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMilestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">No milestones recorded yet.</p>
            ) : (
              recentMilestones.map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{m.student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {milestoneLabels[m.type]} · {new Date(m.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {milestoneLabels[m.type]}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, bg, value, label, href }: {
  icon: React.ReactNode; bg: string; value: number; label: string; href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="flex items-center gap-3 pt-5">
          <div className={`p-2 rounded-md ${bg}`}>{icon}</div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
