// src/components/finance/CashAndBankManagement.tsx
export default function CashAndBankManagement() {
  const accounts = [
    { name: 'Main Operating', balance: '$185,420' },
    { name: 'Payroll', balance: '$42,380' },
    { name: 'Savings', balance: '$320,000' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Cash & Bank Management</h3>
      <div className="space-y-3">
        {accounts.map((account, index) => (
          <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span className="text-gray-600">{account.name}</span>
            <span className="font-medium">{account.balance}</span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Liquidity:</span>
            <span className="font-medium">$547,800</span>
          </div>
        </div>
      </div>
    </div>
  );
}