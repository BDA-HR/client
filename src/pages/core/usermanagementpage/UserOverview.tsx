import React, { useState } from 'react';
import List from '../../../components/List/list';
import { 
  GENDER_OPTIONS, 
  REGION_OPTIONS, 
  STATUS_OPTIONS, 
} from '../../../data/list/list';
import type { ListItem, UUID } from '../../../types/List/list';

const UserOverview: React.FC = () => {

  const [selectedGender, setSelectedGender] = useState<UUID | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<UUID | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<UUID | undefined>(undefined);


  const handleSelect = (setter: React.Dispatch<React.SetStateAction<UUID | undefined>>) => (item: ListItem) => {
    setter(item.id);
  };

  const getSelectedName = (items: ListItem[], id: UUID | undefined) => {
    return items.find(item => item.id === id)?.name || 'Not selected';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Reusable List Component</h1>
          </div>
          
          <div className="space-y-6">
            <List
              items={GENDER_OPTIONS}
              selectedValue={selectedGender}
              onSelect={handleSelect(setSelectedGender)}
              label="Gender"
              placeholder="Select your gender"
              required
            />
            
            <List
              items={REGION_OPTIONS}
              selectedValue={selectedRegion}
              onSelect={handleSelect(setSelectedRegion)}
              label="Region"
              placeholder="Select your region"
            />
            
            <List
              items={STATUS_OPTIONS}
              selectedValue={selectedStatus}
              onSelect={handleSelect(setSelectedStatus)}
              label="Account Status"
              placeholder="Select status"
            />
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Selected Values</h2>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{getSelectedName(GENDER_OPTIONS, selectedGender)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Region:</span>
                <span className="font-medium">{getSelectedName(REGION_OPTIONS, selectedRegion)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{getSelectedName(STATUS_OPTIONS, selectedStatus)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserOverview;