import { Card } from "@/components/ui/card";

interface SummaryCardProps {
  totalSpent: number;
  topCategory: string;
  expenseCount: number;
}

export function SummaryCard({
  totalSpent,
  topCategory,
  expenseCount,
}: SummaryCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 shadow-sm mb-4">
      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Total Spent
          </p>
          <p className="text-3xl font-bold text-gray-900">
            ${totalSpent.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-gray-500 mb-1">Top Category</p>
            <p className="text-sm font-medium text-gray-900">{topCategory}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Entries</p>
            <p className="text-sm font-medium text-gray-900">{expenseCount}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
