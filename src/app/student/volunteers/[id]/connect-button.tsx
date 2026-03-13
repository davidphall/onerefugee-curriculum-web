"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HandHeart, MessageSquare, Check } from "lucide-react";

interface Props {
  volunteerId: string;
  volunteerName: string;
  isConnected: boolean;
}

export function ConnectButton({ volunteerId, volunteerName, isConnected }: Props) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(isConnected);
  const router = useRouter();

  async function handleConnect() {
    if (connected) {
      router.push(`/messages/${volunteerId}`);
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/volunteer/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteerId }),
      });
      setConnected(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (connected) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex-1">
          <Check className="h-4 w-4 shrink-0" />
          You&apos;re connected with {volunteerName}
        </div>
        <Button
          onClick={() => router.push(`/messages/${volunteerId}`)}
          className="bg-black text-white hover:bg-black/80 gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Send Message
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
      className="bg-[#E07B39] hover:bg-[#c96a2e] text-white gap-2 w-full sm:w-auto"
    >
      <HandHeart className="h-4 w-4" />
      {loading ? "Connecting…" : `Connect with ${volunteerName}`}
    </Button>
  );
}
