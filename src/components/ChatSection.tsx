import { useState, useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";
import type { Message } from "@/types";

interface ChatSectionProps {
  onSendMessage: (input: string) => Promise<void>;
  onVoiceClick: () => void;
  messages: Message[];
  isLoading: boolean;
}

export function ChatSection({
  onSendMessage,
  onVoiceClick,
  messages,
  isLoading,
}: ChatSectionProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50/30 to-white">
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Smart Money, Smarter Conversations
        </h2>
        <p className="text-sm text-gray-500">
          Your personal financial intelligence.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">Start a conversation...</p>
            <p className="text-xs text-gray-300 mt-2">
              Try: "I spent $50 on coffee" or "How much did I spend on food?"
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-6 pt-4">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-center bg-white rounded-full px-4 py-2 shadow-sm"
        >
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            placeholder="Type a message..."
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400"
            disabled={isLoading}
          />

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onVoiceClick}
            className="rounded-full h-9 w-9 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
          >
            <Mic className="w-4 h-4" />
          </Button>

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="rounded-full h-9 w-9 bg-gradient-to-br from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
