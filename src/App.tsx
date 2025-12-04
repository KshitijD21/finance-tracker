import { useState, useEffect } from "react";
import { TopBar } from "./components/TopBar";
import { ChatSection } from "./components/ChatSection";
import { ExpensesSection } from "./components/ExpensesSection";
import { VoiceMode } from "./components/VoiceMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "./lib/api";
import { getUserId } from "./lib/user";
import type { Message, Expense } from "./types";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Initialize userId and load expenses
  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    loadExpenses(id);
  }, []);

  const loadExpenses = async (uid: string) => {
    try {
      const response = await api.getExpenses(uid);
      if (response.success) {
        setExpenses(response.expenses);
      }
    } catch (error) {
      console.error("Failed to load expenses:", error);
    }
  };

  const handleSendMessage = async (input: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.sendVoiceCommand(userId, input);

      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        content: response.message,
        timestamp: Date.now(),
      };

      // If an expense was added, include it in the message
      if (response.data?.expense) {
        aiMessage.expense = {
          merchant: response.data.expense.merchant || "Unknown",
          amount: response.data.expense.amount,
          category: response.data.expense.category,
        };
      }

      setMessages((prev) => [...prev, aiMessage]);

      // Reload expenses
      await loadExpenses(userId);
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = async (transcript: string) => {
    await handleSendMessage(transcript);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopBar currentMonth={currentMonth} />

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-[65%] h-full">
          <ChatSection
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onVoiceClick={() => setIsVoiceMode(true)}
          />
        </div>
        <div className="w-[35%] h-full">
          <ExpensesSection expenses={expenses} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1 overflow-hidden">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <TabsList className="w-full grid grid-cols-2 rounded-none h-12 bg-gray-50">
            <TabsTrigger
              value="chat"
              className="rounded-full mx-2 data-[state=active]:bg-white"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="rounded-full mx-2 data-[state=active]:bg-white"
            >
              Expenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden">
            <ChatSection
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onVoiceClick={() => setIsVoiceMode(true)}
            />
          </TabsContent>

          <TabsContent value="expenses" className="flex-1 mt-0 overflow-hidden">
            <ExpensesSection expenses={expenses} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Voice Mode Overlay */}
      <VoiceMode
        isActive={isVoiceMode}
        onClose={() => setIsVoiceMode(false)}
        onTranscript={handleVoiceTranscript}
      />
    </div>
  );
}

export default App;
