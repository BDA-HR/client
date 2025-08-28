import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { MapPin } from 'lucide-react';
import type { Company } from '../../types/core/comp';
import type { Branch } from '../../types/core/branch';

interface BranchViewProps {
  company: Company | undefined;
  branches: Branch[];
  onBack: () => void;
}

const BranchView: React.FC<BranchViewProps> = ({ company, branches, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Branches of {company?.name}
        </h2>
        <Button 
          onClick={onBack}
          variant="outline"
        >
          Back to Companies
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <Card key={branch.id} className="p-4 space-y-3">
            <h4 className="text-md font-semibold">{branch.name}</h4>
            <p className="text-sm text-gray-600">ID: {branch.branchId}</p>
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4" />
              {branch.city}, {branch.country}
            </div>
            <div className="flex items-center text-sm">
              <span className={`px-2 py-1 text-xs rounded-full ${
                branch.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                branch.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {branch.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BranchView;