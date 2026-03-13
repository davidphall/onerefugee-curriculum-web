"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Goal {
  id: string;
  text: string;
  checked: boolean;
}

interface InternshipData {
  skillsGap?: string[];
  titles?: string[];
  companies?: string[];
  tools?: string[];
  goals?: Goal[];
}

function newId() { return Math.random().toString(36).slice(2); }

interface Props {
  data: Record<string, unknown>;
  onSave: (v: Record<string, unknown>) => void;
  readOnly: boolean;
}

function TagList({
  label,
  items,
  onAdd,
  onRemove,
  placeholder,
  readOnly,
}: {
  label: string;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  readOnly: boolean;
}) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (v && !items.includes(v)) { onAdd(v); setInput(""); }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-1 text-sm bg-muted px-2.5 py-1 rounded-full">
            {item}
            {!readOnly && (
              <button onClick={() => onRemove(item)}>
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </span>
        ))}
      </div>
      {!readOnly && (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder={placeholder}
            className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={add}
            className="flex items-center gap-1 text-sm border rounded-md px-3 py-2 hover:bg-muted transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      )}
    </div>
  );
}

export function InternshipStrategyTab({ data, onSave, readOnly }: Props) {
  const parsed = data as InternshipData;
  const [skillsGap, setSkillsGap] = useState<string[]>(parsed.skillsGap ?? []);
  const [titles, setTitles] = useState<string[]>(parsed.titles ?? []);
  const [companies, setCompanies] = useState<string[]>(parsed.companies ?? []);
  const [tools, setTools] = useState<string[]>(parsed.tools ?? []);
  const [goals, setGoals] = useState<Goal[]>(parsed.goals ?? []);
  const [goalInput, setGoalInput] = useState("");

  function save(updates: Partial<InternshipData>) {
    onSave({ skillsGap, titles, companies, tools, goals, ...updates });
  }

  function addGoal() {
    if (!goalInput.trim()) return;
    const updated = [...goals, { id: newId(), text: goalInput.trim(), checked: false }];
    setGoals(updated);
    setGoalInput("");
    save({ goals: updated });
  }

  function toggleGoal(id: string) {
    if (readOnly) return;
    const updated = goals.map((g) => g.id === id ? { ...g, checked: !g.checked } : g);
    setGoals(updated);
    save({ goals: updated });
  }

  function removeGoal(id: string) {
    if (readOnly) return;
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    save({ goals: updated });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-lg">Internship Search Strategy</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Plan your internship search with your career coach.
        </p>
      </div>

      <TagList
        label="Skills Gap — What skills do you need to develop?"
        items={skillsGap}
        onAdd={(v) => { const u = [...skillsGap, v]; setSkillsGap(u); save({ skillsGap: u }); }}
        onRemove={(v) => { const u = skillsGap.filter((s) => s !== v); setSkillsGap(u); save({ skillsGap: u }); }}
        placeholder="e.g. Public speaking"
        readOnly={readOnly}
      />

      <TagList
        label="Target Internship Titles"
        items={titles}
        onAdd={(v) => { const u = [...titles, v]; setTitles(u); save({ titles: u }); }}
        onRemove={(v) => { const u = titles.filter((s) => s !== v); setTitles(u); save({ titles: u }); }}
        placeholder="e.g. Marketing Intern"
        readOnly={readOnly}
      />

      <TagList
        label="Target Companies"
        items={companies}
        onAdd={(v) => { const u = [...companies, v]; setCompanies(u); save({ companies: u }); }}
        onRemove={(v) => { const u = companies.filter((s) => s !== v); setCompanies(u); save({ companies: u }); }}
        placeholder="e.g. Adobe"
        readOnly={readOnly}
      />

      <TagList
        label="Search Tools to Use"
        items={tools}
        onAdd={(v) => { const u = [...tools, v]; setTools(u); save({ tools: u }); }}
        onRemove={(v) => { const u = tools.filter((s) => s !== v); setTools(u); save({ tools: u }); }}
        placeholder="e.g. LinkedIn, Handshake"
        readOnly={readOnly}
      />

      {/* Semester Goals */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Semester Goals</label>
        <div className="space-y-2">
          {goals.map((goal) => (
            <div key={goal.id} className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${goal.checked ? "bg-green-50 border-green-200" : "bg-white"}`}>
              <input
                type="checkbox"
                checked={goal.checked}
                onChange={() => toggleGoal(goal.id)}
                disabled={readOnly}
                className="h-4 w-4 accent-[#E07B39]"
              />
              <span className={`text-sm flex-1 ${goal.checked ? "line-through text-muted-foreground" : ""}`}>
                {goal.text}
              </span>
              {!readOnly && (
                <button onClick={() => removeGoal(goal.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <input
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGoal(); } }}
              placeholder="Add a semester goal…"
              className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={addGoal}
              className="flex items-center gap-1 text-sm border rounded-md px-3 py-2 hover:bg-muted transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
