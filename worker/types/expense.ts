export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  merchant?: string;
  date: string;
  createdAt: number;
}

export interface AddExpenseRequest {
  userId: string;
  amount: number;
  description: string;
}

export interface AddExpenseResponse {
  success: boolean;
  expense?: Expense;
  error?: string;
}
