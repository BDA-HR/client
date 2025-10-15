import React, { useState } from 'react';
import PositionHeader from '../../components/hr/position/PositionHeader';
import type { PositionExpListDto } from '../../types/hr/position';
import PositionSearchFilters from '../../components/hr/position/PositonSearchFilter';

function PagePosition() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [positionData] = useState<PositionExpListDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddPosition = () => {
    console.log('Add position clicked');
  };

  return (
    <div className="container mx-auto ">
      <PositionHeader 
        positionData={positionData}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <PositionSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        positionData={positionData}
        onAddClick={handleAddPosition}
      />
      

    </div>
  );
}

export default PagePosition;