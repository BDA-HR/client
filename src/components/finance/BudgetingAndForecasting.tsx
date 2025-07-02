export default function BudgetingAndForecasting() {
  const budgets = [
    { department: 'Marketing', used: 75, budget: 100 },
    { department: 'Sales', used: 92, budget: 120 },
    { department: 'R&D', used: 45, budget: 80 },
    { department: 'Operations', used: 65, budget: 90 },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Budgeting & Forecasting</h3>
      <div className="space-y-3">
        {budgets.map((budget, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{budget.department}</span>
              <span className="font-medium">${budget.used}K / ${budget.budget}K</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  budget.used > budget.budget ? 'bg-red-500' : 
                  budget.used > budget.budget * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, (budget.used / budget.budget) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Budget Utilization:</span>
            <span className="text-sm font-medium">72%</span>
          </div>
        </div>
      </div>
    </div>
  );
}