"use client";

import { useState } from "react";
import { OnboardingTab } from "./tabs/onboarding-tab";
import { CareerComparerTab } from "./tabs/career-comparer-tab";
import { DegreePlanTab } from "./tabs/degree-plan-tab";
import { InternshipStrategyTab } from "./tabs/internship-strategy-tab";
import { JobStrategyTab } from "./tabs/job-strategy-tab";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Briefcase } from "lucide-react";

const TABS = [
  { id: "onboarding", label: "Summer Onboarding" },
  { id: "career", label: "Career Comparer" },
  { id: "degree", label: "Degree Plan" },
  { id: "internship", label: "Internship Strategy" },
  { id: "job", label: "Job Search Strategy" },
] as const;

type TabId = typeof TABS[number]["id"];

interface WorkspaceData {
  studentId: string;
  onboarding?: Record<string, boolean> | null;
  careerComparer?: Record<string, unknown> | null;
  degreePlan?: Record<string, unknown> | null;
  internshipStrategy?: Record<string, unknown> | null;
  jobStrategy?: Record<string, unknown> | null;
  isHealthcareTrack?: boolean;
}

interface Props {
  workspace: WorkspaceData;
  studentId?: string; // if staff is viewing a student
  readOnly?: boolean;
}

export function WorkspaceClient({ workspace, studentId, readOnly = false }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("onboarding");
  const [saving, setSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  async function save(field: string, value: unknown) {
    if (readOnly) return;
    if (saveTimer) clearTimeout(saveTimer);
    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch("/api/workspace", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(studentId ? { studentId } : {}),
            [field]: value,
          }),
        });
      } finally {
        setSaving(false);
      }
    }, 800);
    setSaveTimer(timer);
  }

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-center justify-between gap-4 border-b">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-[#E07B39] text-[#E07B39]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0 pb-1">
          {saving && <span className="text-xs text-muted-foreground">Saving…</span>}
          {!saving && <span className="text-xs text-muted-foreground opacity-0">Saved</span>}
          <Link
            href={studentId ? `/staff/students/${studentId}/applications` : "/student/workspace/applications"}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border rounded-md px-3 py-1.5 transition-colors"
          >
            <Briefcase className="h-3.5 w-3.5" />
            Job Tracker
          </Link>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "onboarding" && (
        <OnboardingTab
          data={workspace.onboarding ?? {}}
          onSave={(v) => save("onboarding", v)}
          readOnly={readOnly}
        />
      )}
      {activeTab === "career" && (
        <CareerComparerTab
          data={(workspace.careerComparer as Record<string, unknown>) ?? {}}
          onSave={(v) => save("careerComparer", v)}
          readOnly={readOnly}
        />
      )}
      {activeTab === "degree" && (
        <DegreePlanTab
          data={(workspace.degreePlan as Record<string, unknown>) ?? {}}
          isHealthcare={workspace.isHealthcareTrack ?? false}
          onSave={(v) => save("degreePlan", v)}
          onToggleHealthcare={(v) => save("isHealthcareTrack", v)}
          readOnly={readOnly}
        />
      )}
      {activeTab === "internship" && (
        <InternshipStrategyTab
          data={(workspace.internshipStrategy as Record<string, unknown>) ?? {}}
          onSave={(v) => save("internshipStrategy", v)}
          readOnly={readOnly}
        />
      )}
      {activeTab === "job" && (
        <JobStrategyTab
          data={(workspace.jobStrategy as Record<string, unknown>) ?? {}}
          onSave={(v) => save("jobStrategy", v)}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}
