import { Inbox } from "lucide-react";
export default function EmptyState({ message = "No data found", icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
      <Icon className="w-12 h-12 stroke-1" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
