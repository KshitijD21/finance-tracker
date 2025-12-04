import type { VoiceCommandResponse, ExpenseResponse } from '@/types';

const API_BASE = '/api';

export const api = {
  async sendVoiceCommand(userId: string, input: string): Promise<VoiceCommandResponse> {
    const response = await fetch(`${API_BASE}/voice-command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, input }),
    });

    if (!response.ok) {
      throw new Error('Failed to process command');
    }

    return response.json();
  },

  async getExpenses(userId: string): Promise<ExpenseResponse> {
    const response = await fetch(`${API_BASE}/expenses/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    return response.json();
  },

  async addExpense(userId: string, input: string): Promise<VoiceCommandResponse> {
    const response = await fetch(`${API_BASE}/expense-natural`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, input }),
    });

    if (!response.ok) {
      throw new Error('Failed to add expense');
    }

    return response.json();
  },

  async clearExpenses(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/expenses/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to clear expenses');
    }
  },
};
