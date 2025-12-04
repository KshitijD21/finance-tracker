import { DurableObject } from "cloudflare:workers";
import type { Env } from '../types/env';
import type { Expense } from '../types/expense';

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
}
