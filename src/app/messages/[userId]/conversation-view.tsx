"use client";

import { useState, useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Send } from "lucide-react";
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
  recipient: { id: string; name: string; role: string };
  initialMessages: Message[];
}

export function ConversationView({ currentUserId, recipient, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`dm:${[currentUserId, recipient.id].sort().join("-")}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `or(and(sender_id.eq.${currentUserId},recipient_id.eq.${recipient.id}),and(sender_id.eq.${recipient.id},recipient_id.eq.${currentUserId}))`,
        },
        (payload) => {
          const row = payload.new as {
            id: string; body: string; sent_at: string;
            sender_id: string; sender_name?: string;
          };
          setMessages((prev) => {
            if (prev.find((m) => m.id === row.id)) return prev;
            return [...prev, {
              id: row.id,
              body: row.body,
              sentAt: row.sent_at,
              senderId: row.sender_id,
              senderName: row.sender_id === currentUserId ? "You" : recipient.name,
            }];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUserId, recipient.id, recipient.name, supabase]);

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
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: recipient.id, body: optimistic.body }),
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
          {recipient.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-sm">{recipient.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{recipient.role.toLowerCase()}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Say hello!
          </p>
        )}
        {messages.map((m) => {
          const isMe = m.senderId === currentUserId;
          return (
            <div key={m.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
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
          placeholder={`Message ${recipient.name}...`}
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
  );
}
