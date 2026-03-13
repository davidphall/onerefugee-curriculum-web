"use client";

import { useState } from "react";

const STEPS = [
  { id: "assessment", label: "Complete a career assessment (e.g. O*NET Interest Profiler)" },
  { id: "explore", label: "Explore career options using O*NET OnLine and Bureau of Labor Statistics" },
  { id: "informational", label: "Conduct at least one informational interview" },
];

const CATEGORIES = [
  { id: "education", label: "Education & Skills Required" },
  { id: "experience", label: "Experience" },
  { id: "salary", label: "Salary" },
  { id: "interest", label: "Interest" },
  { id: "lifeBalance", label: "Life Balance" },
  { id: "outlook", label: "Career Outlook" },
];

interface MajorData {
  name: string;
  education: string;
  experience: string;
  salary: string;
  interest: string;
  lifeBalance: string;
  outlook: string;
}

interface CareerData {
  steps?: Record<string, boolean>;
  majors?: [MajorData, MajorData, MajorData];
}

const emptyMajor = (): MajorData => ({
  name: "", education: "", experience: "", salary: "", interest: "", lifeBalance: "", outlook: "",
});

interface Props {
  data: Record<string, unknown>;
  onSave: (v: Record<string, unknown>) => void;
  readOnly: boolean;
}

export function CareerComparerTab({ data, onSave, readOnly }: Props) {
  const parsed = data as CareerData;
  const [steps, setSteps] = useState<Record<string, boolean>>(parsed.steps ?? {});
  const [majors, setMajors] = useState<[MajorData, MajorData, MajorData]>(
    parsed.majors ?? [emptyMajor(), emptyMajor(), emptyMajor()]
  );

  function toggleStep(id: string) {
    if (readOnly) return;
    const updated = { ...steps, [id]: !steps[id] };
    setSteps(updated);
    onSave({ steps: updated, majors });
  }

  function updateMajor(index: number, field: keyof MajorData, value: string) {
    if (readOnly) return;
    const updated = majors.map((m, i) => i === index ? { ...m, [field]: value } : m) as [MajorData, MajorData, MajorData];
    setMajors(updated);
    onSave({ steps, majors: updated });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-lg">Career Comparer</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Research and compare your top three majors before making a decision.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Steps to Complete</h3>
        <div className="space-y-2">
          {STEPS.map((step) => (
            <label
              key={step.id}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                readOnly ? "cursor-default" : "cursor-pointer hover:bg-muted/40"
              } ${steps[step.id] ? "bg-green-50 border-green-200" : "bg-white"}`}
            >
              <input
                type="checkbox"
                checked={!!steps[step.id]}
                onChange={() => toggleStep(step.id)}
                disabled={readOnly}
                className="h-4 w-4 mt-0.5 accent-[#E07B39]"
              />
              <span className={`text-sm ${steps[step.id] ? "line-through text-muted-foreground" : ""}`}>
                {step.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Major Comparison</h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-40">Category</th>
                {[0, 1, 2].map((i) => (
                  <th key={i} className="px-3 py-2 w-1/3">
                    <input
                      value={majors[i].name}
                      onChange={(e) => updateMajor(i, "name", e.target.value)}
                      disabled={readOnly}
                      placeholder={`Major ${i + 1}`}
                      className="w-full text-sm font-semibold text-center bg-transparent border-b border-dashed border-input focus:outline-none focus:border-[#E07B39] placeholder:text-muted-foreground/50 disabled:cursor-default"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat, ri) => (
                <tr key={cat.id} className={ri % 2 === 0 ? "bg-white" : "bg-muted/10"}>
                  <td className="px-4 py-3 font-medium text-muted-foreground text-xs">{cat.label}</td>
                  {[0, 1, 2].map((i) => (
                    <td key={i} className="px-3 py-2">
                      <textarea
                        value={majors[i][cat.id as keyof MajorData]}
                        onChange={(e) => updateMajor(i, cat.id as keyof MajorData, e.target.value)}
                        disabled={readOnly}
                        rows={2}
                        placeholder="…"
                        className="w-full text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-[#E07B39] rounded px-1 placeholder:text-muted-foreground/30 disabled:cursor-default"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
