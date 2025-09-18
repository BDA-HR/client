import React from 'react';
import type { UUID } from 'crypto';
import type { ListProps } from '../../types/List/list';

const List: React.FC<ListProps> = ({
  items,
  selectedValue,
  onSelect,
  label,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  required = false
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value as UUID;
    const selectedItem = items.find(item => item.id === selectedId);
    if (selectedItem) {
      onSelect(selectedItem);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={selectedValue || ""}
        onChange={handleChange}
        disabled={disabled}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-emerald-500 focus:border-emerald-500
          text-sm transition-colors
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
        `}
        required={required}
      >
        <option value="" disabled className="text-gray-500">
          {placeholder}
        </option>
        {items.map((item) => (
          <option key={item.id} value={item.id} className="text-gray-900">
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default List;