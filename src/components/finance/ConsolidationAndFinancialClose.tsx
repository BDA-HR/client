export default function ConsolidationAndFinancialClose() {
  const entities = [
    { name: 'Parent Company', status: 'Complete' },
    { name: 'Subsidiary A', status: 'Complete' },
    { name: 'Subsidiary B', status: 'Pending' },
    { name: 'Subsidiary C', status: 'In Progress' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Consolidation & Financial Close</h3>
      <div className="space-y-3">
        {entities.map((entity, index) => (
          <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span className="text-gray-700">{entity.name}</span>
            <span className={`text-xs px-2 py-1 rounded ${
              entity.status === 'Complete' ? 'bg-green-100 text-green-800' :
              entity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {entity.status}
            </span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Close Status:</span>
            <span className="text-sm font-medium">75% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}