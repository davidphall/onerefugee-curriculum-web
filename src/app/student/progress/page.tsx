import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Star, Trophy, BookOpen, CheckCircle2 } from "lucide-react";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [enrollments, progressRecords, points, badges, streak] =
    await Promise.all([
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
      }),
      prisma.progress.findMany({ where: { studentId: user.id } }),
      prisma.points.aggregate({
        where: { studentId: user.id },
        _sum: { amount: true },
      }),
      prisma.studentBadge.findMany({
        where: { studentId: user.id },
        include: { badge: true },
      }),
      prisma.streak.findUnique({ where: { studentId: user.id } }),
    ]);

  const completedSet = new Set(progressRecords.map((p) => p.lessonId));
  const totalPoints = points._sum.amount ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">My Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your learning journey.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Star className="h-5 w-5 text-[#E07B39]" />}
          bg="bg-[#E07B39]/10"
          value={totalPoints}
          label="Total Points"
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          bg="bg-orange-50"
          value={streak?.currentStreak ?? 0}
          label="Day Streak"
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-yellow-500" />}
          bg="bg-yellow-50"
          value={badges.length}
          label="Badges Earned"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-blue-500" />}
          bg="bg-blue-50"
          value={progressRecords.length}
          label="Lessons Done"
        />
      </div>

      {/* Streak detail */}
      {streak && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" /> Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">
                {streak.currentStreak}
              </p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{streak.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Longest</p>
            </div>
            {streak.lastActiveDate && (
              <p className="text-sm text-muted-foreground">
                Last active{" "}
                {new Date(streak.lastActiveDate).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Course progress */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Course Progress</h2>
        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No courses enrolled yet.
            </CardContent>
          </Card>
        ) : (
          enrollments.map(({ course, completedAt }) => {
            const allLessons = course.modules.flatMap((m) => m.lessons);
            const total = allLessons.length;
            const done = allLessons.filter((l) => completedSet.has(l.id)).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Card key={course.id}>
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{course.title}</p>
                      {completedAt && (
                        <Badge className="bg-green-600 text-white border-0 text-xs">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-semibold">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    {done} of {total} lessons complete
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </section>

      {/* Badges */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Badges</h2>
        {badges.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Complete lessons to earn your first badge!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map(({ badge, earnedAt }) => (
              <Card key={badge.id} className="text-center">
                <CardContent className="pt-5 space-y-2">
                  <div className="text-3xl">{badge.iconUrl ?? "🏅"}</div>
                  <p className="text-sm font-medium">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(earnedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  bg,
  value,
  label,
}: {
  icon: React.ReactNode;
  bg: string;
  value: number;
  label: string;
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
