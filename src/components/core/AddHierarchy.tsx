import { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  nameAm: string;
  parentId?: number;
}

interface Connector {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const AddHierarchy = () => {
  const allCompanies: Company[] = [
    { id: 1, name: 'Rohobot Tech', nameAm: 'ሮሆቦት ቴክ', parentId: 0 },
    { id: 2, name: 'EthioDev', nameAm: 'ኢትዮዴቭ', parentId: 0 },
    { id: 3, name: 'Rohobot Group', nameAm: 'ሮሆቦት ግሩፕ', parentId: 1},
  ];

  const [parentCompanies, setParentCompanies] = useState<Company[]>(allCompanies);
  const [childCompanies, setChildCompanies] = useState<Company[]>(allCompanies.filter(c => c.parentId === 0));
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [connectors, setConnectors] = useState<Connector[]>([]);

  const parentRef = useRef<HTMLDivElement>(null);
  const childContainerRef = useRef<HTMLDivElement>(null);
  const connectorsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const updateConnectors = () => {
      if (!parentRef.current || !childContainerRef.current || !connectorsRef.current) return;

      const parentRect = parentRef.current.getBoundingClientRect();
      const svgRect = connectorsRef.current.getBoundingClientRect();

      const parentCenterX = parentRect.left + parentRect.width / 2 - svgRect.left;
      const parentBottomY = parentRect.bottom - svgRect.top;

      const newConnectors: Connector[] = [];
      const childRows = childContainerRef.current.querySelectorAll('.child-row');

      childRows.forEach((row) => {
        const rowRect = row.getBoundingClientRect();
        const rowCenterX = rowRect.left + rowRect.width / 2 - svgRect.left;
        const rowTopY = rowRect.top - svgRect.top;

        newConnectors.push({
          x1: parentCenterX,
          y1: parentBottomY,
          x2: rowCenterX,
          y2: rowTopY,
        });
      });

      setConnectors(newConnectors);
    };

    updateConnectors();
    window.addEventListener('resize', updateConnectors);
    return () => window.removeEventListener('resize', updateConnectors);
  }, [childCompanies]);

  const handleAddHierarchy = () => {
    const company = allCompanies.find((c) => c.id.toString() === selectedCompanyId);
    const parentCompany = allCompanies.find((c) => c.id.toString() === selectedParentId);
    
    if (!company || !parentCompany) return;
    const updatedCompany = { ...company, parentId: parentCompany.id };    
    setChildCompanies((prev) => [...prev, updatedCompany]);
    setSelectedCompanyId('');
    setSelectedParentId('');
    setOpenDialog(false);
  };

  const handleRemoveCompany = (id: number) => {
    setChildCompanies(prev => prev.filter(company => company.id !== id));
  };

  const getParentName = (parentId: number) => {
    if (parentId === 0) return 'BDA';
    const parent = allCompanies.find(c => c.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  const getParentNameAm = (parentId: number) => {
    if (parentId === 0) return 'ቢዲኤ';
    const parent = allCompanies.find(c => c.id === parentId);
    return parent ? parent.nameAm : 'Unknown';
  };

  return (
    <div className="space-y-6 relative">
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        .connector-path {
          animation: draw 1s ease-in-out forwards;
        }
      `}</style>

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Organization Hierarchy</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} />
              Add Hierarchy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Hierarchy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Company</Label>
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger className="h-12 text-base px-4 w-full">
                    <SelectValue placeholder="Choose company..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allCompanies.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.nameAm} ({c.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Parent Company</Label>
                <Select
                  value={selectedParentId}
                  onValueChange={setSelectedParentId}
                >
                  <SelectTrigger className="h-12 text-base px-4 w-full">
                    <SelectValue placeholder="Choose parent company..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">BDA (ቢዲኤ)</SelectItem>
                    {allCompanies.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.nameAm} ({c.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleAddHierarchy}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Parent Company */}
      <div ref={parentRef}>
        <Card className="w-full p-6 shadow-md border border-gray-200 bg-gray-50 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Parent Company</h2>
          <div className="flex justify-center">
            <Card className="max-w-lg w-full p-6 shadow-md border border-gray-200 bg-white text-center">
              <h3 className="text-2xl font-bold text-gray-800">ቢዲኤ</h3>
              <p className="text-lg text-gray-600">BDA</p>
            </Card>
          </div>
        </Card>
      </div>
      <svg
        ref={connectorsRef}
        className="absolute w-full h-[200px] top-[calc(100%-20px)] left-0 pointer-events-none z-0"
        style={{ height: '200px' }}
      >
        {connectors.map((conn, index) => (
          <path
            key={index}
            d={`M${conn.x1},${conn.y1} C${conn.x1},${conn.y1 + 50} ${conn.x2},${conn.y2 - 50} ${conn.x2},${conn.y2}`}
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            className="connector-path"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </svg>

      {/* Child Companies */}
      <div ref={childContainerRef} className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name (Amharic)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name (English)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {childCompanies.map((company, index) => (
              <tr key={index} className="child-row hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {company.nameAm}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getParentNameAm(company.parentId || 0)} ({getParentName(company.parentId || 0)})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveCompany(company.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {childCompanies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No companies added yet. Click "Add Hierarchy" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AddHierarchy;