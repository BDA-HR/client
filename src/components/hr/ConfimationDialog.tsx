import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  confirmColor = 'green',
  onConfirm,
  onCancel
}) => {
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-yellow-500 mr-3" size={24} />
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md ${colorClasses[confirmColor]} flex items-center`}
            >
              <Check className="mr-2" size={18} />
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;