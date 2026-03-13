"use client";

import { useState } from "react";

const PROMPTS = [
  {
    id: "experienceGaps",
    label: "Skills & Experience Gaps",
    question: "What experience and industry skills do you need to gain in order to be a competitive applicant?",
  },
  {
    id: "network",
    label: "Network",
    question: "Who can you reach out to in your network? How can you gain more connections?",
  },
  {
    id: "jobTitles",
    label: "Job Titles",
    question: "What job titles should you be searching and saving as an alert?",
  },
  {
    id: "hiringProcess",
    label: "Hiring Process",
    question: "What do you need to learn in order to go through the hiring process and get a job?",
  },
  {
    id: "expandOpportunities",
    label: "Expand Opportunities",
    question: "How can you expand your opportunities? Are there other locations or industries you can explore?",
  },
] as const;

type PromptId = typeof PROMPTS[number]["id"];

interface Props {
  data: Record<string, unknown>;
  onSave: (v: Record<string, unknown>) => void;
  readOnly: boolean;
}

export function JobStrategyTab({ data, onSave, readOnly }: Props) {
  const [answers, setAnswers] = useState<Partial<Record<PromptId, string>>>(
    data as Partial<Record<PromptId, string>>
  );

  function update(id: PromptId, value: string) {
    if (readOnly) return;
    const updated = { ...answers, [id]: value };
    setAnswers(updated);
    onSave(updated);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-lg">Job Search Strategy</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Work through these questions with your career coach to build your job search plan.
        </p>
      </div>

      <div className="space-y-6">
        {PROMPTS.map((prompt) => (
          <div key={prompt.id} className="space-y-2">
            <label className="text-sm font-semibold">{prompt.label}</label>
            <p className="text-sm text-muted-foreground">{prompt.question}</p>
            <textarea
              value={answers[prompt.id] ?? ""}
              onChange={(e) => update(prompt.id, e.target.value)}
              disabled={readOnly}
              rows={4}
              placeholder="Write your answer here…"
              className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground/40 disabled:cursor-default disabled:bg-muted/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
