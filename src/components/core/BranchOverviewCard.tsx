import React from 'react';

interface BranchCardProps {
  onClick: () => void;
}

const BranchCard: React.FC<BranchCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '300px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3>Branch</h3>
      <p>Click to view details</p>
    </div>
  );
};

export default BranchCard;
