import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Users } from "lucide-react";
import { CreateCourseButton } from "./create-course-button";

const categoryColors: Record<string, string> = {
  EDUCATION:    "bg-blue-50 text-blue-700 border-blue-200",
  PROFESSIONAL: "bg-purple-50 text-purple-700 border-purple-200",
  WELLNESS:     "bg-green-50 text-green-700 border-green-200",
  FINANCIAL:    "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-50 text-green-700 border-green-200",
  DRAFT:     "bg-gray-50 text-gray-600 border-gray-200",
  ARCHIVED:  "bg-red-50 text-red-600 border-red-200",
};

export default async function CoursesAdminPage() {
  const courses = await prisma.course.findMany({
    include: {
      modules: { include: { lessons: true, assignments: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-muted-foreground mt-1">{courses.length} total courses</p>
        </div>
        <CreateCourseButton />
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium">No courses yet</p>
            <p className="text-sm text-muted-foreground">Create your first course to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => {
            const totalLessons = course.modules.flatMap((m) => m.lessons).length;
            const totalAssignments = course.modules.flatMap((m) => m.assignments).length;
            return (
              <Link key={course.id} href={`/admin/courses/${course.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
                      <div className="flex gap-1.5 shrink-0">
                        <Badge variant="outline" className={`text-xs ${statusColors[course.status]}`}>
                          {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${categoryColors[course.category]}`}>
                          {course.category.charAt(0) + course.category.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{course.modules.length} modules</span>
                      <span>{totalLessons} lessons</span>
                      <span>{totalAssignments} assignments</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {course._count.enrollments} enrolled
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
