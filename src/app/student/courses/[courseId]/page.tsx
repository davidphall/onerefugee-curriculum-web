import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  FileText,
  PlayCircle,
  BookOpen,
  ChevronLeft,
  Lock,
} from "lucide-react";

const lessonTypeIcon = {
  READING: BookOpen,
  VIDEO: PlayCircle,
  QUIZ: FileText,
  DOCUMENT: FileText,
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [enrollment, completedLessons] = await Promise.all([
    prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: user.id, courseId } },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: { orderBy: { order: "asc" } },
                assignments: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    }),
    prisma.progress.findMany({
      where: { studentId: user.id },
      select: { lessonId: true },
    }),
  ]);

  if (!enrollment) notFound();

  const { course } = enrollment;
  const completedSet = new Set(completedLessons.map((p) => p.lessonId));
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completedSet.has(l.id)).length;
  const percent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // First incomplete lesson for "continue" button
  const nextLesson = allLessons.find((l) => !completedSet.has(l.id));

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/student/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to courses
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        {course.description && (
          <p className="text-muted-foreground">{course.description}</p>
        )}

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount} of {totalLessons} lessons complete
            </span>
            <span className="font-medium">{percent}%</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>

        {/* Continue button */}
        {nextLesson && (
          <Link
            href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
            className="inline-flex items-center gap-2 bg-[#E07B39] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#c96a2e] transition-colors"
          >
            {completedCount === 0 ? "Start Course" : "Continue"}{" "}
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Link>
        )}
        {!nextLesson && totalLessons > 0 && (
          <Badge className="bg-green-600 text-white border-0">
            Course Complete
          </Badge>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {course.modules.map((module, moduleIdx) => {
          const moduleLessons = module.lessons;
          const moduleCompleted = moduleLessons.filter((l) =>
            completedSet.has(l.id)
          ).length;

          // A module is locked if the previous module isn't fully complete
          const prevModule = course.modules[moduleIdx - 1];
          const isLocked =
            moduleIdx > 0 &&
            prevModule &&
            prevModule.lessons.some((l) => !completedSet.has(l.id));

          return (
            <Card key={module.id} className={isLocked ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                    <CardTitle className="text-base">{module.title}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {moduleCompleted}/{moduleLessons.length}
                  </span>
                </div>
                {module.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {module.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-1 pt-0">
                {moduleLessons.map((lesson) => {
                  const done = completedSet.has(lesson.id);
                  const Icon = lessonTypeIcon[lesson.type] ?? BookOpen;
                  return (
                    <Link
                      key={lesson.id}
                      href={
                        isLocked
                          ? "#"
                          : `/student/courses/${courseId}/lessons/${lesson.id}`
                      }
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                        isLocked
                          ? "cursor-not-allowed text-muted-foreground"
                          : "hover:bg-muted cursor-pointer"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className={done ? "line-through text-muted-foreground" : ""}>
                        {lesson.title}
                      </span>
                    </Link>
                  );
                })}

                {module.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground"
                  >
                    <Circle className="h-4 w-4 shrink-0" />
                    <FileText className="h-4 w-4 shrink-0" />
                    <span>{assignment.title}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      Assignment
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
