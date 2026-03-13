"use client";

import { useState } from "react";

const SECTIONS = [
  {
    id: "career",
    label: "Career Exploration",
    items: [
      { id: "assessment", label: "Complete career assessment" },
      { id: "explore", label: "Explore career options using provided resources" },
      { id: "comparer", label: "Complete Career Comparer worksheet" },
    ],
  },
  {
    id: "registration",
    label: "Class Registration",
    items: [
      { id: "advisor", label: "Meet with academic advisor" },
      { id: "register", label: "Register for first semester classes" },
      { id: "confirm", label: "Confirm class schedule with career coach" },
      { id: "degreeplan", label: "Complete degree plan with career coach" },
    ],
  },
  {
    id: "financial",
    label: "Financial Plan",
    items: [
      { id: "ferpa", label: "Sign FERPA form" },
      { id: "aid", label: "Review financial aid package" },
      { id: "plan", label: "Create financial plan for the school year" },
      { id: "billing", label: "Set up student billing account" },
    ],
  },
];

interface Props {
  data: Record<string, boolean>;
  onSave: (v: Record<string, boolean>) => void;
  readOnly: boolean;
}

export function OnboardingTab({ data, onSave, readOnly }: Props) {
  const [items, setItems] = useState<Record<string, boolean>>(data);

  function toggle(id: string) {
    if (readOnly) return;
    const updated = { ...items, [id]: !items[id] };
    setItems(updated);
    onSave(updated);
  }

  const total = SECTIONS.flatMap((s) => s.items).length;
  const done = Object.values(items).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Summer Onboarding Checklist</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Complete these steps before your first semester begins.
          </p>
        </div>
        <span className="text-sm font-medium text-muted-foreground">{done}/{total} complete</span>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.id} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {section.label}
          </h3>
          <div className="space-y-2">
            {section.items.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  readOnly ? "cursor-default" : "cursor-pointer hover:bg-muted/40"
                } ${items[item.id] ? "bg-green-50 border-green-200" : "bg-white"}`}
              >
                <input
                  type="checkbox"
                  checked={!!items[item.id]}
                  onChange={() => toggle(item.id)}
                  disabled={readOnly}
                  className="h-4 w-4 accent-[#E07B39]"
                />
                <span className={`text-sm ${items[item.id] ? "line-through text-muted-foreground" : ""}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
