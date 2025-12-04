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
    console.log('💾 DO: Adding expense:', expense.description);

    let expenses = await this.ctx.storage.get<Expense[]>('expenses');
    if (!expenses) {
      expenses = [];
    }

    expenses.push(expense);
    await this.ctx.storage.put('expenses', expenses);

    console.log('✅ DO: Saved! Total:', expenses.length);
  }

  // RPC method: Get expenses
  async getExpenses(): Promise<Expense[]> {
    console.log('📖 DO: Getting expenses');

    let expenses = await this.ctx.storage.get<Expense[]>('expenses');
    if (!expenses) {
      expenses = [];
    }

    console.log('✅ DO: Found:', expenses.length);
    return expenses;
  }

  async deleteExpense(expenseId: string): Promise<boolean> {
    console.log('🗑️ DO: Deleting expense:', expenseId);

    let expenses = await this.ctx.storage.get<Expense[]>('expenses');
    if (!expenses) {
      return false;
    }

    const initialLength = expenses.length;
    expenses = expenses.filter(e => e.id !== expenseId);

    if (expenses.length === initialLength) {
      console.log('❌ DO: Expense not found');
      return false;
    }

    await this.ctx.storage.put('expenses', expenses);
    console.log('✅ DO: Deleted! Remaining:', expenses.length);
    return true;
  }

  // RPC method: Clear expenses
  async clearExpenses(): Promise<void> {
    console.log('🗑️ DO: Clearing expenses');
    await this.ctx.storage.delete('expenses');
    console.log('✅ DO: Cleared');
  }

  // RPC method: Add chat message
  async addChatMessage(message: ChatMessage): Promise<void> {
    console.log('💬 DO: Adding chat message [' + message.role + ']:', message.content.substring(0, 50));

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
    console.log('✅ DO: Chat saved! Total:', messages.length, 'Role breakdown:',
      messages.filter(m => m.role === 'user').length, 'user,',
      messages.filter(m => m.role === 'ai').length, 'ai');
  }

  // RPC method: Get chat messages
  async getChatMessages(): Promise<ChatMessage[]> {
    console.log('📖 DO: Getting chat messages');

    let messages = await this.ctx.storage.get<ChatMessage[]>('chatMessages');
    if (!messages) {
      messages = [];
    }

    console.log('✅ DO: Found:', messages.length, 'messages. Role breakdown:',
      messages.filter(m => m.role === 'user').length, 'user,',
      messages.filter(m => m.role === 'ai').length, 'ai');
    return messages;
  }

  // RPC method: Clear chat history
  async clearChatMessages(): Promise<void> {
    console.log('🗑️ DO: Clearing chat messages');
    await this.ctx.storage.delete('chatMessages');
    console.log('✅ DO: Chat cleared');
  }
}
