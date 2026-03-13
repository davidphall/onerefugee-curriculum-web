import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, CheckCircle, Clock } from "lucide-react";

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [enrollments, progressCount, pendingSubmissions] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: user.id },
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: true },
            },
          },
        },
      },
      take: 4,
    }),
    prisma.progress.count({ where: { studentId: user.id } }),
    prisma.submission.count({
      where: { studentId: user.id, status: "PENDING" },
    }),
  ]);

  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your progress.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-md bg-[#E07B39]/10">
              <BookOpen className="h-5 w-5 text-[#E07B39]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{enrollments.length}</p>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-md bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{progressCount}</p>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-md bg-yellow-50">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{pendingSubmissions}</p>
              <p className="text-sm text-muted-foreground">Pending Assignments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Courses</h2>
        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              You haven&apos;t been enrolled in any courses yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrollments.map(({ course }) => {
              const totalLessons = course.modules.flatMap((m) => m.lessons).length;
              const categoryColors: Record<string, string> = {
                EDUCATION: "bg-blue-50 text-blue-700",
                PROFESSIONAL: "bg-purple-50 text-purple-700",
                WELLNESS: "bg-green-50 text-green-700",
                FINANCIAL: "bg-yellow-50 text-yellow-700",
              };
              return (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <Badge
                        className={`text-xs shrink-0 ${categoryColors[course.category] ?? ""}`}
                        variant="outline"
                      >
                        {course.category.charAt(0) + course.category.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.description ?? "No description available."}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Trophy className="h-3 w-3" />
                      <span>{totalLessons} lessons</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
