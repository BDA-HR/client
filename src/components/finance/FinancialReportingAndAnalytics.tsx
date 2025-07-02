export default function FinancialReportingAndAnalytics() {
  const reports = [
    { name: 'Income Statement', lastRun: '2023-12-15' },
    { name: 'Balance Sheet', lastRun: '2023-12-15' },
    { name: 'Cash Flow', lastRun: '2023-12-15' },
    { name: 'Budget Variance', lastRun: '2023-12-10' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Financial Reporting & Analytics</h3>
      <div className="space-y-3">
        {reports.map((report, index) => (
          <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span className="text-gray-700">{report.name}</span>
            <span className="text-xs text-gray-500">{report.lastRun}</span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Next Report:</span>
            <span className="text-sm font-medium">2024-01-05</span>
          </div>
        </div>
      </div>
    </div>
  );
}