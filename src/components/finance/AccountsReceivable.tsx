// src/components/finance/AccountsReceivable.tsx
export default function AccountsReceivable() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Accounts Receivable</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Receivables:</span>
          <span className="font-medium">$243,650</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Over 90 Days:</span>
          <span className="text-red-600 font-medium">$38,720</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Avg. Days Outstanding:</span>
          <span className="font-medium">42</span>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex space-x-1">
            {['30d', '60d', '90d+'].map((period, idx) => (
              <div key={period} className="flex-1">
                <div className="text-xs text-gray-600">{period}</div>
                <div className={`h-2 mt-1 rounded ${idx === 0 ? 'bg-green-400' : idx === 1 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                     style={{ width: `${[60, 25, 15][idx]}%` }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}