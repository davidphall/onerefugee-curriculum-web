import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  EDUCATION: "bg-blue-50 text-blue-700 border-blue-200",
  PROFESSIONAL: "bg-purple-50 text-purple-700 border-purple-200",
  WELLNESS: "bg-green-50 text-green-700 border-green-200",
  FINANCIAL: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default async function CoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: user.id },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  const completedLessonIds = await prisma.progress.findMany({
    where: { studentId: user.id },
    select: { lessonId: true },
  });
  const completedSet = new Set(completedLessonIds.map((p) => p.lessonId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Courses</h1>
        <p className="text-muted-foreground mt-1">
          {enrollments.length} course{enrollments.length !== 1 ? "s" : ""} enrolled
        </p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium">No courses yet</p>
            <p className="text-sm text-muted-foreground">
              Your courses will appear here once you&apos;re enrolled.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {enrollments.map(({ course, completedAt }) => {
            const allLessons = course.modules.flatMap((m) => m.lessons);
            const totalLessons = allLessons.length;
            const completedCount = allLessons.filter((l) =>
              completedSet.has(l.id)
            ).length;
            const percent =
              totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0;

            return (
              <Link key={course.id} href={`/student/courses/${course.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">
                        {course.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-xs ${categoryColors[course.category] ?? ""}`}
                        >
                          {course.category.charAt(0) +
                            course.category.slice(1).toLowerCase()}
                        </Badge>
                        {completedAt && (
                          <Badge className="text-xs bg-green-600 text-white border-0">
                            Complete
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {completedCount} / {totalLessons} lessons
                        </span>
                        <span>{percent}%</span>
                      </div>
                      <Progress value={percent} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>{course.modules.length} modules</span>
                      <span className="flex items-center gap-0.5 text-[#E07B39] font-medium">
                        View course <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
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
