"use client";

import { useState } from "react";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  name: string;
  credits: string;
  grade?: string;
}

interface Semester {
  id: string;
  label: string;
  type: "fall" | "spring" | "summer";
  courses: Course[];
}

interface Prerequisite {
  id: string;
  course: string;
  grade: string;
}

interface DegreePlanData {
  semesters?: Semester[];
  prerequisites?: Prerequisite[];
}

function newId() {
  return Math.random().toString(36).slice(2);
}

function newCourse(): Course {
  return { id: newId(), name: "", credits: "" };
}

function newSemester(type: "fall" | "spring" | "summer", index: number): Semester {
  const labels = { fall: "Fall", spring: "Spring", summer: "Summer" };
  return { id: newId(), label: `${labels[type]} ${new Date().getFullYear() + Math.floor(index / 3)}`, type, courses: [newCourse()] };
}

interface Props {
  data: Record<string, unknown>;
  isHealthcare: boolean;
  onSave: (v: Record<string, unknown>) => void;
  onToggleHealthcare: (v: boolean) => void;
  readOnly: boolean;
}

export function DegreePlanTab({ data, isHealthcare, onSave, onToggleHealthcare, readOnly }: Props) {
  const parsed = data as DegreePlanData;
  const [semesters, setSemesters] = useState<Semester[]>(parsed.semesters ?? [newSemester("fall", 0)]);
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>(parsed.prerequisites ?? []);
  const [healthcare, setHealthcare] = useState(isHealthcare);

  function save(s: Semester[], p: Prerequisite[]) {
    onSave({ semesters: s, prerequisites: p });
  }

  function addSemester(type: "fall" | "spring" | "summer") {
    if (readOnly) return;
    const updated = [...semesters, newSemester(type, semesters.length)];
    setSemesters(updated);
    save(updated, prerequisites);
  }

  function removeSemester(id: string) {
    if (readOnly) return;
    const updated = semesters.filter((s) => s.id !== id);
    setSemesters(updated);
    save(updated, prerequisites);
  }

  function updateSemesterLabel(id: string, label: string) {
    if (readOnly) return;
    const updated = semesters.map((s) => s.id === id ? { ...s, label } : s);
    setSemesters(updated);
    save(updated, prerequisites);
  }

  function addCourse(semId: string) {
    if (readOnly) return;
    const updated = semesters.map((s) => s.id === semId ? { ...s, courses: [...s.courses, newCourse()] } : s);
    setSemesters(updated);
    save(updated, prerequisites);
  }

  function removeCourse(semId: string, courseId: string) {
    if (readOnly) return;
    const updated = semesters.map((s) => s.id === semId ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) } : s);
    setSemesters(updated);
    save(updated, prerequisites);
  }

  function updateCourse(semId: string, courseId: string, field: keyof Course, value: string) {
    if (readOnly) return;
    const updated = semesters.map((s) =>
      s.id === semId
        ? { ...s, courses: s.courses.map((c) => c.id === courseId ? { ...c, [field]: value } : c) }
        : s
    );
    setSemesters(updated);
    save(updated, prerequisites);
  }

  function semesterCredits(s: Semester) {
    return s.courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
  }

  function totalCredits() {
    return semesters.reduce((sum, s) => sum + semesterCredits(s), 0);
  }

  function addPrerequisite() {
    if (readOnly) return;
    const updated = [...prerequisites, { id: newId(), course: "", grade: "" }];
    setPrerequisites(updated);
    save(semesters, updated);
  }

  function removePrerequisite(id: string) {
    if (readOnly) return;
    const updated = prerequisites.filter((p) => p.id !== id);
    setPrerequisites(updated);
    save(semesters, updated);
  }

  function updatePrerequisite(id: string, field: "course" | "grade", value: string) {
    if (readOnly) return;
    const updated = prerequisites.map((p) => p.id === id ? { ...p, [field]: value } : p);
    setPrerequisites(updated);
    save(semesters, updated);
  }

  function toggleHealthcare() {
    if (readOnly) return;
    const next = !healthcare;
    setHealthcare(next);
    onToggleHealthcare(next);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-lg">Degree Plan</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Plan your courses semester by semester to graduation. Total: <strong>{totalCredits()} credits</strong>
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={healthcare}
            onChange={toggleHealthcare}
            disabled={readOnly}
            className="h-4 w-4 accent-[#E07B39]"
          />
          <span className="text-sm font-medium">Healthcare Track</span>
        </label>
      </div>

      {/* Semesters */}
      <div className="space-y-6">
        {semesters.map((sem) => {
          const credits = semesterCredits(sem);
          return (
            <div key={sem.id} className="rounded-lg border overflow-hidden">
              {/* Semester header */}
              <div className="flex items-center justify-between bg-muted/30 px-4 py-2.5 border-b">
                <input
                  value={sem.label}
                  onChange={(e) => updateSemesterLabel(sem.id, e.target.value)}
                  disabled={readOnly}
                  className="font-semibold text-sm bg-transparent focus:outline-none border-b border-dashed border-input focus:border-[#E07B39] disabled:cursor-default"
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{credits} credits</span>
                  {!readOnly && semesters.length > 1 && (
                    <button onClick={() => removeSemester(sem.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Courses */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left px-4 py-2 font-medium">Course</th>
                    <th className="text-center px-3 py-2 font-medium w-20">Credits</th>
                    {healthcare && <th className="text-center px-3 py-2 font-medium w-20">Grade</th>}
                    {!readOnly && <th className="w-8" />}
                  </tr>
                </thead>
                <tbody>
                  {sem.courses.map((course) => (
                    <tr key={course.id} className="border-b last:border-0">
                      <td className="px-4 py-2">
                        <input
                          value={course.name}
                          onChange={(e) => updateCourse(sem.id, course.id, "name", e.target.value)}
                          disabled={readOnly}
                          placeholder="e.g. English 101"
                          className="w-full bg-transparent focus:outline-none placeholder:text-muted-foreground/40 disabled:cursor-default"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={course.credits}
                          onChange={(e) => updateCourse(sem.id, course.id, "credits", e.target.value)}
                          disabled={readOnly}
                          placeholder="3"
                          className="w-full text-center bg-transparent focus:outline-none placeholder:text-muted-foreground/40 disabled:cursor-default"
                        />
                      </td>
                      {healthcare && (
                        <td className="px-3 py-2">
                          <input
                            value={course.grade ?? ""}
                            onChange={(e) => updateCourse(sem.id, course.id, "grade", e.target.value)}
                            disabled={readOnly}
                            placeholder="A"
                            className="w-full text-center bg-transparent focus:outline-none placeholder:text-muted-foreground/40 disabled:cursor-default"
                          />
                        </td>
                      )}
                      {!readOnly && (
                        <td className="pr-2">
                          <button
                            onClick={() => removeCourse(sem.id, course.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {!readOnly && (
                <div className="px-4 py-2 border-t bg-white">
                  <button
                    onClick={() => addCourse(sem.id)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3 w-3" /> Add course
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add semester buttons */}
      {!readOnly && (
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => addSemester("fall")} className="gap-1">
            <Plus className="h-3.5 w-3.5" /> Fall Semester
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSemester("spring")} className="gap-1">
            <Plus className="h-3.5 w-3.5" /> Spring Semester
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSemester("summer")} className="gap-1">
            <Plus className="h-3.5 w-3.5" /> Summer Semester
          </Button>
        </div>
      )}

      {/* Healthcare prerequisites */}
      {healthcare && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#E07B39]" />
            <h3 className="font-semibold text-sm">Healthcare Prerequisites</h3>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="text-left px-4 py-2 font-medium">Prerequisite Course</th>
                  <th className="text-center px-3 py-2 font-medium w-24">Grade Earned</th>
                  {!readOnly && <th className="w-8" />}
                </tr>
              </thead>
              <tbody>
                {prerequisites.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-2">
                      <input
                        value={p.course}
                        onChange={(e) => updatePrerequisite(p.id, "course", e.target.value)}
                        disabled={readOnly}
                        placeholder="e.g. Biology 1010"
                        className="w-full bg-transparent focus:outline-none placeholder:text-muted-foreground/40 disabled:cursor-default"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={p.grade}
                        onChange={(e) => updatePrerequisite(p.id, "grade", e.target.value)}
                        disabled={readOnly}
                        placeholder="A"
                        className="w-full text-center bg-transparent focus:outline-none placeholder:text-muted-foreground/40 disabled:cursor-default"
                      />
                    </td>
                    {!readOnly && (
                      <td className="pr-2">
                        <button onClick={() => removePrerequisite(p.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {!readOnly && (
              <div className="px-4 py-2 border-t bg-white">
                <button
                  onClick={addPrerequisite}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add prerequisite
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
