export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  expense?: {
    id: string;
    amount: number;
    category: string;
    merchant: string;
  };
}
