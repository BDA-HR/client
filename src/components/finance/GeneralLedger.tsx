export default function GeneralLedger() {
  const accounts = [
    { name: 'Assets', balance: '$1.2M' },
    { name: 'Liabilities', balance: '$850K' },
    { name: 'Equity', balance: '$350K' },
    { name: 'Revenue', balance: '$2.1M' },
    { name: 'Expenses', balance: '$1.8M' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">General Ledger</h3>
      <div className="space-y-2">
        {accounts.map((account, index) => (
          <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span className="text-gray-600">{account.name}</span>
            <span className="font-medium">{account.balance}</span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Net Income:</span>
            <span className="font-medium text-green-600">$300K</span>
          </div>
        </div>
      </div>
    </div>
  );
}