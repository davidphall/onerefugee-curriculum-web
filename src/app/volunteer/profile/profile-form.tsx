"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

interface Props {
  initialBio: string;
  initialSkills: string[];
  initialAvailability: string;
  initialLinkedinUrl: string;
}

export function ProfileForm({ initialBio, initialSkills, initialAvailability, initialLinkedinUrl }: Props) {
  const [bio, setBio] = useState(initialBio);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [skillInput, setSkillInput] = useState("");
  const [availability, setAvailability] = useState(initialAvailability);
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedinUrl);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/volunteer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, skills, availability, linkedinUrl }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell students about your background and why you volunteer…"
              rows={4}
              className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Skills &amp; Expertise</label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="e.g. Resume Writing"
                className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="button" variant="outline" onClick={addSkill} className="gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Availability</label>
            <input
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Weekday evenings, 1–2 hrs/week"
              className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">LinkedIn URL <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/…"
              className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-black/80">
              {loading ? "Saving…" : "Save Profile"}
            </Button>
            {saved && <span className="text-sm text-green-600">Saved!</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
