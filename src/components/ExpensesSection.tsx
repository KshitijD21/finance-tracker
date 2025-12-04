import { SummaryCard } from "./SummaryCard";
import { ExpenseCard } from "./ExpenseCard";
import type { Expense } from "@/types";

interface ExpensesSectionProps {
  expenses: Expense[];
  onExpensesClick?: () => void;
}

export function ExpensesSection({ expenses }: ExpensesSectionProps) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryCounts = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "None";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          This Month's Expenses
        </h2>
      </div>

      {/* Summary */}
      <div className="px-6">
        <SummaryCard
          totalSpent={totalSpent}
          topCategory={topCategory}
          expenseCount={expenses.length}
        />
      </div>

      {/* Expenses List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No expenses yet</p>
            <p className="text-xs text-gray-300 mt-2">
              Add your first expense via chat
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {expenses
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
