import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, BookOpen, FileText, PlayCircle, Users } from "lucide-react";
import { CourseStatusSelect } from "./course-status-select";
import { AddModuleButton } from "./add-module-button";
import { AddLessonButton } from "./add-lesson-button";
import { EnrollStudentsButton } from "./enroll-students-button";
import { UnenrollButton } from "./unenroll-button";

const lessonTypeIcon: Record<string, typeof BookOpen> = {
  READING: BookOpen, VIDEO: PlayCircle, QUIZ: FileText, DOCUMENT: FileText,
};

export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const [course, allStudents] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: { orderBy: { order: "asc" } },
            assignments: true,
          },
          orderBy: { order: "asc" },
        },
        enrollments: {
          include: {
            student: {
              include: {
                studentProfile: true,
                progress: { select: { lessonId: true } },
              },
            },
          },
          orderBy: { enrolledAt: "desc" },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!course) notFound();

  const enrolledIds = new Set(course.enrollments.map((e) => e.studentId));
  const unenrolledStudents = allStudents.filter((s) => !enrolledIds.has(s.id));
  const totalLessons = course.modules.flatMap((m) => m.lessons).length;

  return (
    <div className="space-y-6">
      <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to courses
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground mt-1 text-sm">{course.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{course.enrollments.length} enrolled</span>
            <span>·</span>
            <span>{course.modules.length} modules</span>
            <span>·</span>
            <span>{totalLessons} lessons</span>
          </div>
        </div>
        <CourseStatusSelect courseId={course.id} currentStatus={course.status} />
      </div>

      {/* Enrollments */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Enrolled Students ({course.enrollments.length})
            </CardTitle>
            <EnrollStudentsButton
              courseId={courseId}
              unenrolledStudents={unenrolledStudents}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {course.enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-4">No students enrolled yet.</p>
          ) : (
            <div className="divide-y">
              {course.enrollments.map(({ student, enrolledAt, completedAt }) => {
                const completedCount = student.progress.length;
                const pct = totalLessons > 0
                  ? Math.round((completedCount / totalLessons) * 100)
                  : 0;

                return (
                  <div key={student.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{student.name}</p>
                        {completedAt && (
                          <Badge className="text-xs bg-green-600 text-white border-0">Complete</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student.studentProfile?.university ?? "No university"} ·{" "}
                        {pct}% complete · Enrolled {new Date(enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <UnenrollButton studentId={student.id} courseId={courseId} studentName={student.name} />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{module.title}</CardTitle>
                  {module.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{module.description}</p>
                  )}
                </div>
                <AddLessonButton moduleId={module.id} currentOrder={module.lessons.length} />
              </div>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {module.lessons.length === 0 && module.assignments.length === 0 ? (
                <p className="text-xs text-muted-foreground px-3 py-2">No content yet.</p>
              ) : (
                <>
                  {module.lessons.map((lesson) => {
                    const Icon = lessonTypeIcon[lesson.type] ?? BookOpen;
                    return (
                      <div key={lesson.id} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="flex-1">{lesson.title}</span>
                        <Badge variant="outline" className="text-xs">{lesson.type.charAt(0) + lesson.type.slice(1).toLowerCase()}</Badge>
                      </div>
                    );
                  })}
                  {module.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex-1">{assignment.title}</span>
                      <Badge variant="outline" className="text-xs bg-[#E07B39]/10 text-[#E07B39] border-[#E07B39]/20">Assignment</Badge>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AddModuleButton courseId={courseId} currentOrder={course.modules.length} />
    </div>
  );
}
