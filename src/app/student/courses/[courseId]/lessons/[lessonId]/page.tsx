import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarkCompleteButton } from "./mark-complete-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [lesson, enrollment, completed] = await Promise.all([
    prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: { lessons: { orderBy: { order: "asc" } } },
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    }),
    prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: user.id, courseId } },
    }),
    prisma.progress.findUnique({
      where: { studentId_lessonId: { studentId: user.id, lessonId } },
    }),
  ]);

  if (!lesson || !enrollment) notFound();

  // Build flat lesson list for prev/next navigation
  const allLessons = lesson.module.course.modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = allLessons[currentIdx - 1];
  const nextLesson = allLessons[currentIdx + 1];

  const typeLabel: Record<string, string> = {
    READING: "Reading",
    VIDEO: "Video",
    QUIZ: "Quiz",
    DOCUMENT: "Document",
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <Link
        href={`/student/courses/${courseId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to course
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {typeLabel[lesson.type]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {lesson.module.title}
          </span>
          {completed && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold">{lesson.title}</h1>
      </div>

      {/* Embedded resource (video, Canva, slides, etc.) */}
      {lesson.videoUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
          />
        </div>
      )}

      {/* Content */}
      {lesson.content && (
        <div className="prose prose-neutral max-w-none text-sm leading-relaxed
          prose-headings:font-semibold prose-headings:text-foreground
          prose-h1:text-2xl prose-h2:text-lg prose-h3:text-base
          prose-p:text-foreground prose-p:my-3
          prose-strong:font-semibold prose-strong:text-foreground
          prose-ul:my-3 prose-ol:my-3 prose-li:my-1
          prose-blockquote:border-l-4 prose-blockquote:border-[#E07B39] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
          prose-table:w-full prose-th:text-left prose-th:font-semibold prose-th:border prose-th:p-2 prose-td:border prose-td:p-2
          prose-code:bg-muted prose-code:px-1 prose-code:rounded
          prose-img:rounded-lg prose-img:w-full prose-img:my-4
          prose-a:text-[#E07B39] prose-a:underline hover:prose-a:text-[#c96a2a]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt ?? ""} className="rounded-lg w-full my-4" />
              ),
            }}
          >
            {lesson.content}
          </ReactMarkdown>
        </div>
      )}

      {!lesson.content && !lesson.videoUrl && (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground text-sm">
          No content available for this lesson yet.
        </div>
      )}

      {/* Mark complete + navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {prevLesson ? (
            <Link
              href={`/student/courses/${courseId}/lessons/${prevLesson.id}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Link>
          ) : (
            <span />
          )}
        </div>

        <MarkCompleteButton
          lessonId={lessonId}
          courseId={courseId}
          completed={!!completed}
          nextLessonId={nextLesson?.id}
        />

        <div>
          {nextLesson ? (
            <Link
              href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
