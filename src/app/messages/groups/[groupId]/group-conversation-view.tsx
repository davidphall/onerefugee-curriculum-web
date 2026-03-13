"use client";

import { useState, useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  body: string;
  sentAt: string;
  senderId: string;
  senderName: string;
}

interface Props {
  currentUserId: string;
  group: {
    id: string;
    name: string;
    description: string | null;
    members: { id: string; name: string; role: string }[];
  };
  initialMessages: Message[];
}

export function GroupConversationView({ currentUserId, group, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`group:${group.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "GroupMessage", filter: `group_id=eq.${group.id}` },
        (payload) => {
          const row = payload.new as { id: string; body: string; sent_at: string; sender_id: string };
          setMessages((prev) => {
            if (prev.find((m) => m.id === row.id)) return prev;
            const member = group.members.find((m) => m.id === row.sender_id);
            return [...prev, {
              id: row.id,
              body: row.body,
              sentAt: row.sent_at,
              senderId: row.sender_id,
              senderName: member?.name ?? "Unknown",
            }];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [group.id, group.members, supabase]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || sending) return;
    setSending(true);
    const optimistic: Message = {
      id: `optimistic-${Date.now()}`,
      body: body.trim(),
      sentAt: new Date().toISOString(),
      senderId: currentUserId,
      senderName: "You",
    };
    setMessages((prev) => [...prev, optimistic]);
    setBody("");
    try {
      await fetch("/api/messages/groups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: group.id, body: optimistic.body }),
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{group.name}</p>
            <p className="text-xs text-muted-foreground">{group.members.length} members</p>
          </div>
        </div>
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          {showMembers ? "Hide" : "Members"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </p>
            )}
            {messages.map((m, i) => {
              const isMe = m.senderId === currentUserId;
              const showName = !isMe && (i === 0 || messages[i - 1].senderId !== m.senderId);
              return (
                <div key={m.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                  {showName && (
                    <p className="text-xs text-muted-foreground mb-1 px-1">{m.senderName}</p>
                  )}
                  <div className={cn(
                    "max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 space-y-0.5",
                    isMe ? "bg-black text-white rounded-br-sm" : "bg-muted rounded-bl-sm"
                  )}>
                    <p className="text-sm leading-relaxed">{m.body}</p>
                    <p className={cn("text-xs", isMe ? "text-white/50" : "text-muted-foreground")}>
                      {new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t px-4 py-3 flex gap-2 shrink-0">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`Message ${group.name}...`}
              className="flex-1 text-sm rounded-full border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!body.trim() || sending}
              className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Members panel */}
        {showMembers && (
          <div className="w-48 border-l overflow-y-auto p-3 space-y-1 shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Members</p>
            {group.members.map((m) => (
              <div key={m.id} className="flex items-center gap-2 py-1">
                <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{m.role.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
