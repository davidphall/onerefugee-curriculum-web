import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, StickyNote } from "lucide-react";
import Link from "next/link";
import { AddNoteForm } from "./add-note-form";

export default async function MenteeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "VOLUNTEER") redirect("/dashboard");

  const connection = await prisma.mentorshipConnection.findUnique({
    where: { id },
    include: {
      student: { include: { studentProfile: true } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!connection || connection.volunteerId !== user.id) notFound();

  const { student, notes } = connection;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[#E07B39]/10 flex items-center justify-center">
            <span className="text-xl font-bold text-[#E07B39]">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{student.name}</h1>
            <p className="text-muted-foreground">{student.email}</p>
          </div>
        </div>
        <Link
          href={`/messages/${student.id}`}
          className="flex items-center gap-2 text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-black/80 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Message
        </Link>
      </div>

      {student.studentProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            {student.studentProfile.university && (
              <div>
                <p className="text-muted-foreground">University</p>
                <p className="font-medium">{student.studentProfile.university}</p>
              </div>
            )}
            {student.studentProfile.major && (
              <div>
                <p className="text-muted-foreground">Major</p>
                <p className="font-medium">{student.studentProfile.major}</p>
              </div>
            )}
            {student.studentProfile.countryOfOrigin && (
              <div>
                <p className="text-muted-foreground">Country of Origin</p>
                <p className="font-medium">{student.studentProfile.countryOfOrigin}</p>
              </div>
            )}
            {student.studentProfile.languages?.length > 0 && (
              <div>
                <p className="text-muted-foreground">Languages</p>
                <p className="font-medium">{student.studentProfile.languages.join(", ")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Private Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddNoteForm connectionId={connection.id} />
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No notes yet. Notes are only visible to you.</p>
          ) : (
            <div className="space-y-3 mt-4">
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm whitespace-pre-wrap">{note.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
