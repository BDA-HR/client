// src/components/finance/AssetManagement.tsx
export default function AssetManagement() {
  const assets = [
    { name: 'Equipment', value: '$420,000', change: '+3.2%' },
    { name: 'Property', value: '$1.2M', change: '+1.5%' },
    { name: 'Vehicles', value: '$85,000', change: '-0.8%' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Asset Management</h3>
      <div className="space-y-3">
        {assets.map((asset, index) => (
          <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span className="text-gray-600">{asset.name}</span>
            <div className="text-right">
              <div className="font-medium">{asset.value}</div>
              <div className={`text-xs ${asset.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {asset.change}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Total Asset Value: $1.7M</span>
          </div>
        </div>
      </div>
    </div>
  );
}