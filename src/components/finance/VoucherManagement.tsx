// src/components/finance/VoucherManagement.tsx
export default function VoucherManagement() {
  const vouchers = [
    { type: 'Payment', count: 42, pending: 8 },
    { type: 'Receipt', count: 28, pending: 3 },
    { type: 'Journal', count: 15, pending: 2 },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-purple-100 hover:border-indigo-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Voucher Management</h3>
      <div className="space-y-3">
        {vouchers.map((voucher, index) => (
          <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span className="text-gray-600">{voucher.type}</span>
            <div className="text-right">
              <div className="font-medium">{voucher.count}</div>
              <div className="text-xs text-red-600">
                {voucher.pending > 0 ? `${voucher.pending} pending` : 'All processed'}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Vouchers:</span>
            <span className="text-sm font-medium">85</span>
          </div>
        </div>
      </div>
    </div>
  );
}