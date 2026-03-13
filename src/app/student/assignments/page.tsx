import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const statusStyles: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  PENDING:  { label: "Pending",  className: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  REVIEWED: { label: "Reviewed", className: "bg-blue-50 text-blue-700 border-blue-200",       icon: FileText },
  APPROVED: { label: "Approved", className: "bg-green-50 text-green-700 border-green-200",    icon: CheckCircle2 },
  REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200",          icon: AlertCircle },
};

export default async function AssignmentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  // Get all assignments from enrolled courses
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: user.id },
    include: {
      course: {
        include: {
          modules: {
            include: {
              assignments: {
                include: {
                  submissions: {
                    where: { studentId: user.id },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  type AssignmentItem = {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    type: string;
    pointValue: number;
    courseId: string;
    courseTitle: string;
    moduleTitle: string;
    submission: { status: string } | null;
  };

  const assignments: AssignmentItem[] = enrollments.flatMap(({ course }) =>
    course.modules.flatMap((module) =>
      module.assignments.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        type: a.type,
        pointValue: a.pointValue,
        courseId: course.id,
        courseTitle: course.title,
        moduleTitle: module.title,
        submission: a.submissions[0] ?? null,
      }))
    )
  );

  const pending = assignments.filter((a) => !a.submission || a.submission.status === "PENDING");
  const submitted = assignments.filter((a) => a.submission && a.submission.status !== "PENDING");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Assignments</h1>
        <p className="text-muted-foreground mt-1">
          {pending.length} pending · {submitted.length} submitted
        </p>
      </div>

      {/* Pending */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Pending</h2>
        {pending.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              All caught up — no pending assignments.
            </CardContent>
          </Card>
        ) : (
          pending.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))
        )}
      </section>

      {/* Submitted */}
      {submitted.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Submitted</h2>
          {submitted.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </section>
      )}
    </div>
  );
}

function AssignmentCard({ assignment: a }: { assignment: {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  type: string;
  pointValue: number;
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  submission: { status: string } | null;
}}) {
  const status = a.submission?.status ?? "PENDING";
  const s = statusStyles[status] ?? statusStyles.PENDING;
  const StatusIcon = s.icon;

  const isOverdue =
    a.dueDate && !a.submission && new Date(a.dueDate) < new Date();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{a.title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {a.courseTitle} · {a.moduleTitle}
            </p>
          </div>
          <Badge variant="outline" className={`text-xs shrink-0 flex items-center gap-1 ${s.className}`}>
            <StatusIcon className="h-3 w-3" />
            {s.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {a.description && (
          <p className="text-sm text-muted-foreground">{a.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {a.dueDate && (
              <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                <Clock className="h-3 w-3" />
                Due {new Date(a.dueDate).toLocaleDateString()}
                {isOverdue && " · Overdue"}
              </span>
            )}
            {a.pointValue > 0 && (
              <span>{a.pointValue} pts</span>
            )}
          </div>
          {!a.submission && (
            <Link
              href={`/student/assignments/${a.id}`}
              className="text-xs text-[#E07B39] font-medium hover:underline"
            >
              Submit →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
