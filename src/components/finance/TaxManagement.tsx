// src/components/finance/TaxManagement.tsx
export default function TaxManagement() {
  const taxes = [
    { name: 'Income Tax', due: '2024-04-15', amount: '$85,000' },
    { name: 'Sales Tax', due: '2024-01-20', amount: '$42,500' },
    { name: 'Property Tax', due: '2024-03-31', amount: '$18,750' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Tax Management</h3>
      <div className="space-y-3">
        {taxes.map((tax, index) => (
          <div key={index} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">{tax.name}</span>
              <span className="font-medium">{tax.amount}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Due:</span>
              <span>{tax.due}</span>
            </div>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Tax Liability:</span>
            <span className="text-sm font-medium">$146,250</span>
          </div>
        </div>
      </div>
    </div>
  );
}