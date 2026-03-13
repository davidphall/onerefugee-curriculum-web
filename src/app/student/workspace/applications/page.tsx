import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { JobTrackerClient } from "./job-tracker-client";

export default async function ApplicationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const applications = await prisma.jobApplication.findMany({
    where: { studentId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Job Application Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track every application and its current status.
          </p>
        </div>
      </div>
      <JobTrackerClient initialApplications={applications} />
    </div>
  );
}
