// src/components/finance/CostAccounting.tsx
export default function CostAccounting() {
  const costCenters = [
    { name: 'Production', actual: 85, budget: 80 },
    { name: 'Marketing', actual: 42, budget: 45 },
    { name: 'R&D', actual: 38, budget: 40 },
    { name: 'Admin', actual: 28, budget: 25 },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Cost Accounting</h3>
      <div className="space-y-3">
        {costCenters.map((center, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{center.name}</span>
              <span className="font-medium">${center.actual}K / ${center.budget}K</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  center.actual > center.budget ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, (center.actual / center.budget) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Variance:</span>
            <span className="text-sm font-medium text-red-600">$8K Over Budget</span>
          </div>
        </div>
      </div>
    </div>
  );
}