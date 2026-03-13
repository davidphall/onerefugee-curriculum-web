import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, BookOpen, FileText, PlayCircle } from "lucide-react";
import { CourseStatusSelect } from "./course-status-select";
import { AddModuleButton } from "./add-module-button";
import { AddLessonButton } from "./add-lesson-button";

const lessonTypeIcon: Record<string, typeof BookOpen> = {
  READING: BookOpen, VIDEO: PlayCircle, QUIZ: FileText, DOCUMENT: FileText,
};

export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { order: "asc" } },
          assignments: true,
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

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
            <span>{course._count.enrollments} enrolled</span>
            <span>·</span>
            <span>{course.modules.length} modules</span>
            <span>·</span>
            <span>{course.modules.flatMap((m) => m.lessons).length} lessons</span>
          </div>
        </div>
        <CourseStatusSelect courseId={course.id} currentStatus={course.status} />
      </div>

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
