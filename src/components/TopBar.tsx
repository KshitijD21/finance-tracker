import { Wallet } from "lucide-react";

interface TopBarProps {
  currentMonth: string;
}

export function TopBar({ currentMonth }: TopBarProps) {
  return (
    <div className="h-16 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-medium text-gray-900">FinChat</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{currentMonth}</span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
      </div>
    </div>
  );
}
