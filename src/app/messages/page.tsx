import { MessageSquare } from "lucide-react";

export default function MessagesIndexPage() {
  return (
    <div className="flex-1 flex items-center justify-center text-center p-8">
      <div className="space-y-2">
        <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto" />
        <p className="font-medium text-muted-foreground">Select a conversation</p>
        <p className="text-sm text-muted-foreground">
          Choose a direct message or group from the sidebar.
        </p>
      </div>
    </div>
  );
}
