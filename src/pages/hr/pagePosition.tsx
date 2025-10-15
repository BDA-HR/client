import React, { useState } from 'react';
import PositionHeader from '../../components/hr/position/PositionHeader';
import type { PositionExpListDto } from '../../types/hr/position';

function PagePosition() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [positionData] = useState<PositionExpListDto[]>([]);

  return (
    <div className="container mx-auto p-6">
      <PositionHeader 
        positionData={positionData}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      

    </div>
  );
}

export default PagePosition;