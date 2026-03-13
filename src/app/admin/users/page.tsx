import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRoleSelect } from "./user-role-select";
import { UserSearch } from "./user-search";
import { AssignStaffModal } from "./assign-staff-modal";

const roleColors: Record<string, string> = {
  STUDENT: "bg-blue-50 text-blue-700 border-blue-200",
  STAFF:   "bg-purple-50 text-purple-700 border-purple-200",
  ADMIN:   "bg-black text-white border-black",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const { q, role } = await searchParams;

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role: role as "STUDENT" | "STAFF" | "ADMIN" } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      studentProfile: true,
      enrollments: { select: { courseId: true } },
      studentAssignments: {
        include: { staff: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const staffList = await prisma.user.findMany({
    where: { role: "STAFF" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-muted-foreground mt-1">{users.length} users found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <UserSearch defaultValue={q} />
        <div className="flex gap-2">
          {["", "STUDENT", "STAFF", "ADMIN"].map((r) => (
            <a
              key={r}
              href={`/admin/users${r ? `?role=${r}` : ""}`}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                (role ?? "") === r
                  ? "bg-black text-white border-black"
                  : "bg-white text-foreground border-border hover:bg-muted"
              }`}
            >
              {r || "All"}
            </a>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground p-6 text-center">No users found.</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <Badge variant="outline" className={`text-xs ${roleColors[user.role]}`}>
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.studentProfile && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {user.studentProfile.university ?? "No university"} ·{" "}
                        {user.studentProfile.major ?? "No major"} ·{" "}
                        {user.enrollments.length} course{user.enrollments.length !== 1 ? "s" : ""}
                      </p>
                    )}
                    {user.role === "STUDENT" && user.studentAssignments.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Assigned to:{" "}
                        {user.studentAssignments.map((a) => a.staff.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {user.role === "STUDENT" && (
                      <AssignStaffModal
                        studentId={user.id}
                        studentName={user.name}
                        staffList={staffList}
                        currentAssignments={user.studentAssignments.map((a) => ({
                          staffId: a.staff.id,
                          staffName: a.staff.name,
                        }))}
                      />
                    )}
                    <UserRoleSelect userId={user.id} currentRole={user.role} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
