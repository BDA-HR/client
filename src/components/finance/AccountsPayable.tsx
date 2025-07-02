export default function AccountsPayable() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Accounts Payable</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Payables:</span>
          <span className="font-medium">$185,420</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Overdue Invoices:</span>
          <span className="text-red-600 font-medium">12</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Due This Week:</span>
          <span className="font-medium">$42,380</span>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Processed: 75%</span>
            <span>Pending: 25%</span>
          </div>
        </div>
      </div>
    </div>
  );
}