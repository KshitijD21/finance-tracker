import { DurableObject } from "cloudflare:workers";
import type { Env } from '../types/env';
import type { Expense } from '../types/expense';
import type { ChatMessage } from '../types/chat';

export class FinanceMemory extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  // RPC method: Add expense
  async addExpense(expense: Expense): Promise<void> {
    let expenses = await this.ctx.storage.get<Expense[]>('expenses');
    if (!expenses) {
      expenses = [];
    }

    expenses.push(expense);
    await this.ctx.storage.put('expenses', expenses);
  }

  // RPC method: Get expenses
  async getExpenses(): Promise<Expense[]> {
    let expenses = await this.ctx.storage.get<Expense[]>('expenses');
    if (!expenses) {
      expenses = [];
    }

    return expenses;
  }

  async deleteExpense(expenseId: string): Promise<boolean> {
    let expenses = await this.ctx.storage.get<Expense[]>('expenses');
    if (!expenses) {
      return false;
    }

    const initialLength = expenses.length;
    expenses = expenses.filter(e => e.id !== expenseId);

    if (expenses.length === initialLength) {
      return false;
    }

    await this.ctx.storage.put('expenses', expenses);
    return true;
  }

  // RPC method: Clear expenses
  async clearExpenses(): Promise<void> {
    await this.ctx.storage.delete('expenses');
  }

  // RPC method: Add chat message
  async addChatMessage(message: ChatMessage): Promise<void> {
    let messages = await this.ctx.storage.get<ChatMessage[]>('chatMessages');
    if (!messages) {
      messages = [];
    }

    messages.push(message);

    // Keep only last 100 messages to prevent storage bloat
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }

    await this.ctx.storage.put('chatMessages', messages);
  }

  // RPC method: Get chat messages
  async getChatMessages(): Promise<ChatMessage[]> {
    let messages = await this.ctx.storage.get<ChatMessage[]>('chatMessages');
    if (!messages) {
      messages = [];
    }

    return messages;
  }

  // RPC method: Clear chat history
  async clearChatMessages(): Promise<void> {
    await this.ctx.storage.delete('chatMessages');
  }
}
