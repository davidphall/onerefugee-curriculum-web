"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, Users, Plus } from "lucide-react";
import { NewDMButton } from "./new-dm-button";
import { NewGroupButton } from "./new-group-button";

interface Props {
  currentUserId: string;
  currentUserRole: string;
  conversations: { id: string; name: string; lastMessage: { body: string } }[];
  groups: { id: string; name: string; lastMessage: string | null }[];
}

export function MessagesSidebar({ currentUserId, currentUserRole, conversations, groups }: Props) {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r flex flex-col shrink-0 bg-white">
      <div className="px-4 py-4 border-b">
        <h2 className="font-semibold text-sm">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Direct Messages */}
        <div className="px-3 pt-4 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
              Direct Messages
            </span>
            <NewDMButton currentUserId={currentUserId} />
          </div>
          {conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground px-1 py-2">No conversations yet.</p>
          ) : (
            conversations.map((c) => {
              const active = pathname === `/messages/${c.id}`;
              return (
                <Link
                  key={c.id}
                  href={`/messages/${c.id}`}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
                    active ? "bg-black text-white" : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                    active ? "bg-white text-black" : "bg-black text-white"
                  )}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate text-xs">{c.name}</p>
                    <p className={cn("text-xs truncate", active ? "text-white/70" : "text-muted-foreground")}>
                      {c.lastMessage.body.slice(0, 30)}{c.lastMessage.body.length > 30 ? "…" : ""}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Groups */}
        <div className="px-3 pt-4 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
              Groups
            </span>
            {(currentUserRole === "STAFF" || currentUserRole === "ADMIN") && (
              <NewGroupButton currentUserId={currentUserId} />
            )}
          </div>
          {groups.length === 0 ? (
            <p className="text-xs text-muted-foreground px-1 py-2">No groups yet.</p>
          ) : (
            groups.map((g) => {
              const active = pathname === `/messages/groups/${g.id}`;
              return (
                <Link
                  key={g.id}
                  href={`/messages/groups/${g.id}`}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
                    active ? "bg-black text-white" : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                    active ? "bg-white text-black" : "bg-muted text-foreground"
                  )}>
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate text-xs">{g.name}</p>
                    {g.lastMessage && (
                      <p className={cn("text-xs truncate", active ? "text-white/70" : "text-muted-foreground")}>
                        {g.lastMessage.slice(0, 30)}{g.lastMessage.length > 30 ? "…" : ""}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
