import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ExternalLink, BookMarked } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddResourceButton } from "./add-resource-button";
import { DeleteResourceButton } from "./delete-resource-button";

const categories = [
  "Campus Resources",
  "Immigration & Legal",
  "Financial Aid",
  "Mental Health & Wellness",
  "Food & Housing",
  "Career & Employment",
  "Community",
  "Other",
];

const categoryColors: Record<string, string> = {
  "Campus Resources":       "bg-blue-50 text-blue-700 border-blue-200",
  "Immigration & Legal":    "bg-purple-50 text-purple-700 border-purple-200",
  "Financial Aid":          "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Mental Health & Wellness": "bg-green-50 text-green-700 border-green-200",
  "Food & Housing":         "bg-orange-50 text-orange-700 border-orange-200",
  "Career & Employment":    "bg-[#E07B39]/10 text-[#E07B39] border-[#E07B39]/30",
  "Community":              "bg-pink-50 text-pink-700 border-pink-200",
  "Other":                  "bg-gray-50 text-gray-600 border-gray-200",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const resources = await prisma.resource.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  const isAdmin = user.role === "ADMIN";

  // Group by category
  const grouped = resources.reduce<Record<string, typeof resources>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const activeCategories = category
    ? [category]
    : categories.filter((c) => grouped[c]?.length > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Helpful links and tools for your college journey.
          </p>
        </div>
        {isAdmin && <AddResourceButton categories={categories} />}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <a
          href="/resources"
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !category
              ? "bg-black text-white border-black"
              : "bg-white text-foreground border-border hover:bg-muted"
          }`}
        >
          All
        </a>
        {categories.map((c) => (
          <a
            key={c}
            href={`/resources?category=${encodeURIComponent(c)}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === c
                ? "bg-black text-white border-black"
                : "bg-white text-foreground border-border hover:bg-muted"
            }`}
          >
            {c}
          </a>
        ))}
      </div>

      {/* Resources */}
      {resources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <BookMarked className="h-10 w-10 text-muted-foreground/30" />
            <p className="font-medium">No resources yet</p>
            {isAdmin && (
              <p className="text-sm text-muted-foreground">
                Add your first resource using the button above.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {activeCategories.map((cat) => {
            const items = grouped[cat];
            if (!items?.length) return null;
            return (
              <section key={cat}>
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${categoryColors[cat] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
                  >
                    {cat}
                  </Badge>
                  <span className="text-sm text-muted-foreground font-normal">
                    {items.length} resource{items.length !== 1 ? "s" : ""}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((r) => (
                    <div
                      key={r.id}
                      className="group relative flex items-start gap-3 rounded-lg border bg-white p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sm hover:text-[#E07B39] transition-colors flex items-center gap-1 group/link"
                        >
                          <span className="truncate">{r.title}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.url}</p>
                      </div>
                      {isAdmin && (
                        <DeleteResourceButton resourceId={r.id} resourceTitle={r.title} />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
