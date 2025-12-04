import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gradient-to-br from-emerald-50 to-teal-50 text-gray-900"
            : "bg-white text-gray-800"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>

        {message.expense && (
          <div className="mt-2 pt-2 border-t border-gray-200/50 text-xs text-gray-600">
            Expense added: {message.expense.merchant} • $
            {message.expense.amount.toFixed(2)} • {message.expense.category}
          </div>
        )}
      </div>
    </div>
  );
}
