import type { Expense } from "@/types";
import {
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Utensils,
  Film,
  Heart,
  Package,
} from "lucide-react";

interface ExpenseCardProps {
  expense: Expense;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Groceries: <ShoppingCart className="w-4 h-4" />,
  "Food & Drinks": <Coffee className="w-4 h-4" />,
  Food: <Utensils className="w-4 h-4" />,
  Transportation: <Car className="w-4 h-4" />,
  Housing: <Home className="w-4 h-4" />,
  Entertainment: <Film className="w-4 h-4" />,
  Healthcare: <Heart className="w-4 h-4" />,
  Other: <Package className="w-4 h-4" />,
};

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const icon = categoryIcons[expense.category] || categoryIcons["Other"];

  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50/50 rounded-xl transition-colors">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {expense.merchant || expense.description}
        </p>
        <p className="text-xs text-gray-500">
          {expense.category} •{" "}
          {new Date(expense.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-gray-900">
          ${expense.amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
