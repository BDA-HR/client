// src/components/finance/AuditAndComplianceManagement.tsx
export default function AuditAndComplianceManagement() {
  const complianceItems = [
    { name: 'SOX Compliance', status: 'Complete', date: '2023-12-15' },
    { name: 'Tax Audit', status: 'Pending', date: '2024-03-31' },
    { name: 'Internal Controls', status: 'In Progress', date: '2024-01-20' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Audit & Compliance</h3>
      <div className="space-y-3">
        {complianceItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <div>
              <div className="font-medium text-gray-700">{item.name}</div>
              <div className="text-xs text-gray-500">{item.date}</div>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              item.status === 'Complete' ? 'bg-green-100 text-green-800' :
              item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Next Audit:</span>
            <span className="text-sm font-medium">2024-02-15</span>
          </div>
        </div>
      </div>
    </div>
  );
}